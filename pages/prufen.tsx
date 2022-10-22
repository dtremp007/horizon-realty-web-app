import { Button, Group } from "@mantine/core";
import useUrlState from "../src/hooks/useUrlState";

const PrufenPage = () => {
    const [state, setState] = useUrlState({count: 0, paper: ["letter", "A4"], chrome: true}, {deserialize: (value) => {
        if (value === "true") return true
        if (value === "false") return false
        return value
    }})

  return (
    <Group mt={60}>
      <Button onClick={() => setState((prev) => ({...prev, count: ++prev.count}))}>Click</Button>
      <p>{typeof state.chrome}</p>
      <SubComponent/>
    </Group>
  );
};
export default PrufenPage;

const SubComponent = () => {
    const [state, setState] = useUrlState({listingType: "house"})

    return (
        <Button>{state.listingType}</Button>
    )
}
