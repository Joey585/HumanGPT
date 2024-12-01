import tensorflow as tf
from flask import Flask, jsonify
from transformers import AutoTokenizer, TFAutoModelForCausalLM
from data_process import process_text
from flask_socketio import SocketIO, send

app = Flask(__name__)
socketio = SocketIO(app)

model_name = "joeylieb/human-discord-gpt2"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = TFAutoModelForCausalLM.from_pretrained(model_name)


@socketio.on("message")
def generate(message):
    raw_data = message.get_json(silent=True)
    if raw_data is None:
        return send(jsonify({"error": "Invalid JSON", "status": 400}))
    conversation = "\n".join(process_text(raw_data["conversation"])) + "\nuser2:"
    input_ids = tokenizer.encode(conversation, return_tensors="tf")
    output_ids = tf.identity(input_ids)
    max_length = len(conversation) + 50
    temperature = 0.8
    top_k = 50
    top_p = 0.9

    generated_response = ""

    for _ in range(max_length - input_ids.shape[1]):
        output = model(output_ids)
        logits = output.logits[:, -1, :]
        logits = logits / temperature

        if top_k > 0:
            values, _ = tf.math.top_k(logits, k=top_k)
            min_values = values[:, -1, tf.newaxis]
            logits = tf.where(logits < min_values, tf.ones_like(logits) * -1e10, logits)

        if top_p > 1.0:
            sorted_logits = tf.sort(logits, direction="DESCENDING")
            cumulative_probs = tf.cumsum(tf.nn.softmax(sorted_logits, axis=-1), axis=-1)
            sorted_indices_to_remove = cumulative_probs > top_p
            sorted_indices_to_remove = tf.concat(
                [tf.zeros_like(sorted_indices_to_remove[:, :1]), sorted_indices_to_remove[:, :-1]], axis=-1)
            indices_to_remove = tf.gather(sorted_indices_to_remove, tf.argsort(logits, direction="DESCENDING"),
                                          batch_dims=1)
            logits = tf.where(indices_to_remove, tf.ones_like(logits) * -1e10, logits)

        next_token_id = tf.random.categorical(logits, num_samples=1)
        next_token_id = tf.cast(next_token_id, tf.int32)
        output_ids = tf.concat([output_ids, next_token_id], axis=-1)

        new_token = tokenizer.decode(next_token_id[0].numpy(), skip_special_tokens=True)
        generated_response += new_token

        send(generated_response)

        if next_token_id[0, 0].numpy() == tokenizer.eos_token_id or next_token_id[0, 0].numpy() == \
                tokenizer.encode('\nuser')[0]:
            break

        send("[END]")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=5000)
