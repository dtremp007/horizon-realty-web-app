import { createContext, useContext } from "react"

interface AnimatedMenuContext {
    cursor: number;
    getItemIndex: (node: HTMLElement) => number;
}

const Context = createContext<AnimatedMenuContext>({} as AnimatedMenuContext);

export const AnimatedMenuProvider = ({ children, value }: { value: AnimatedMenuContext; children: React.ReactNode }) => (
    <Context.Provider value={value}>{children}</Context.Provider>
)

export const useMenuContext = () => useContext(Context);
