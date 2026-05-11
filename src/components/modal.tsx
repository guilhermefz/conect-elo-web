import type React from "react";

interface Props {
    titulo: string;
    onFechar: () => void;
    children: React.ReactNode;
}

export function Modal({ titulo, onFechar, children }: Props) {
    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50">
            <div className="bg-[#1e1b2e] rounded-2xl p-6 w-full max-w-sm mx-4 flex flex-col gap-4">
                <div className="flex items-center justify-between">
                    <h2 className="text-white font-bold text-lg">{titulo}</h2>
                    <button onClick={onFechar} className="text-gray-400 hover:text-white text-xl">x</button>
                </div>
                {children}
            </div>
        </div>
    )
}