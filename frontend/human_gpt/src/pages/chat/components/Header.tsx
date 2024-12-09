import React, {useEffect, useState} from "react";
import Image from "next/image";
import "../css/Header.css"

export const Header = ({activeDropdown}: {activeDropdown: boolean}) => {
    const [models] = useState<Array<{name: string, id: number, desc: string}>>([
        {name: "HumanGPT 1a", id: 1, desc: "First model, not very smart"},
        {name: "HumanGPT 1b", id: 2, desc: "Bug fixes, more parameters"}
    ])
    const [selectedModel] = useState<number>(1);
    const [isOpen, setOpen] = useState<boolean>(activeDropdown);

    const clickedModel = () => {setOpen(!isOpen)}

    const idToModel = (id: number) => {
        return models.filter((model) => model.id === id)[0]
    }

    useEffect(() => {
        setOpen(activeDropdown)
    }, [activeDropdown])

    return (
        <div id="chat-header">
            <div id="chat-dropdown">
                <p onClick={clickedModel}>{idToModel(selectedModel).name}</p>
                <div id="chat-models">
                    {isOpen && <ul>
                        {models.map((model, index) => (
                            <li key={index} className="model-list">
                                <div className="model-list-name">
                                    <span>{model.name}</span>
                                    <span>{model.desc}</span>
                                </div>
                                {index + 1 === selectedModel ? <Image aria-hidden
                                       src="/checkmark-circle.svg"
                                       alt="Checkmark Icon"
                                       width={16}
                                       height={16}/> : null}
                            </li>
                        ))}
                    </ul>}
                </div>
            </div>
        </div>
    )
}
