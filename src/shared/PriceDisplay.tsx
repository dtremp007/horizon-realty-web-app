type Props = {
    price: number;
    currency: string;
}

const PriceDisplay = ({price, currency}: Props) => {
  return (
      <h2 style={{fontWeight: "400", fontSize: "1.8rem"}}>
        {`\$${price.toLocaleString("en")} `}
        <span style={{fontSize: "large"}}>{currency}</span>
      </h2>
  );
};
export default PriceDisplay;
