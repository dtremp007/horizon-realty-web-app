import { MantineProvider } from "@mantine/core";
import { InputTypeConstructor } from "./InputTypeConstructor";
import { PricePlugin } from "./plugins";
import RenderForm from "./RenderForm";

export default { title: "RenderForm" };

const testDummy = {
  title: "Un Casa",
  "(Accordion {:key nil})": {
    "(AccordionItem {:label Details :key nil})": {
      listingType: ["CASA", "LOTE", "BODEGA"],
      price: {
        amount: "$1000",
        currency: ["USD", "MXN"],
      },
      public: true,
      utilities: {
        fire: false,
        water: false,
      },
    },
  },
};

export function SlideInOut() {
  return (
    <MantineProvider
      theme={{
        colorScheme: "dark",
        components: {
          Flex: {
            defaultProps: {
              gap: 18,
            },
          },
        },
      }}
    >
      <div style={{ padding: 50 }}>
        <RenderForm
          schema={testDummy}
          context={{ listingTypes: ["CASA", "LOTE", "BODEGA"] }}
          inputTypeExtensions={[PricePlugin]}
          useFormInput={{
            validate: {
              price: {
                amount: (value) =>
                  (value as unknown as number) > 200
                    ? "Price must be greater than 200"
                    : undefined,
              },
            },
            validateInputOnBlur: true,
          }}
        />
      </div>
    </MantineProvider>
  );
}
