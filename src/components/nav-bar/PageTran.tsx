import {
  Button,
  Flex,
  GroupedTransition,
  Text,
  Transition,
} from "@mantine/core";
import { useHover } from "@mantine/hooks";
import { useState } from "react";
import { IconArrowLeft, IconCheck } from "@tabler/icons";

const PageTran = () => {
  const [classList, setClassList] = useState("");
  const [show, setShow] = useState(true);

  const toggleDropdown = () => {
    if (classList === "fall-in__top") {
      setClassList("fall-out__top");
      setTimeout(() => {
        setShow(false);
      }, 400);
    } else {
      setClassList("fall-in__top");
      setShow(true);
    }
  };

  const toggleNav = () => {
    if (classList === "casc-out__left") {
      setClassList("casc-in__left");
      setShow(true);
    } else {
      setClassList("casc-out__left");
      setTimeout(() => {
          setShow(false);
          setClassList("casc-in__right");
      }, 400);
    }
  };

  return (
    <>
      <Flex direction="column" className={`transition ${classList}`}>
        {show ? (
          <>
            <Flex>
              <IconCheck />
              <Text>A Things</Text>
            </Flex>
            <Flex>
              <IconCheck />
              <Text>A Things</Text>
            </Flex>
            <Flex>
              <IconCheck />
              <Text>A Things</Text>
            </Flex>
            <Flex>
              <IconCheck />
              <Text>A Things</Text>
            </Flex>
          </>
        ) : (
          <>
            <Flex>
              <IconCheck />
              <Text>A Things</Text>
            </Flex>
            <Flex>
              <IconCheck />
              <Text>A Things</Text>
            </Flex>
            <Flex>
              <IconCheck />
              <Text>A Things</Text>
            </Flex>
            <Flex>
              <IconCheck />
              <Text>A Things</Text>
            </Flex>
          </>
        )}
      </Flex>
      <Flex direction="column" align="center" gap={16} pos="fixed" top={300}>
        <Button onClick={toggleDropdown}>Drop-down</Button>
        <Button onClick={toggleNav}>Navigate</Button>
      </Flex>
    </>
  );
};
export default PageTran;
