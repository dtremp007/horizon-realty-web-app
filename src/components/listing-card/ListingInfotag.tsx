type Props = {
  variant: "bedroom" | "bathroom" | "area";
  quantity: number;
};

export default function ListingInfotag({ variant, quantity }: Props) {
  return (
    <div className="listing-card__info-tag">
      {getIcon(variant)}
      {variant === "area" ? `${quantity} sq.ft.` : quantity}
    </div>
  );
}

function getIcon(variant: string) {
  if (variant === "bedroom") {
    return (
      <svg height={23} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 22 23">
        <g className="bed-icon">
          <path d="M.09,19.12S-.79,23,2.88,23H19.72s2.49-.23,2.27-3.2-1-10-1-10a2.29,2.29,0,0,0-2.41-2.21H3.14A2.14,2.14,0,0,0,1,9.83C.83,12.11.09,19.12.09,19.12Z" />
          <path d="M2.05,1.29l-.2,2.82A1.18,1.18,0,0,0,3.1,5.64h5s2,0,2-1.6V1.14S10.13,0,8.44,0H3.64S2.11-.09,2.05,1.29Z" />
          <path d="M19.88,1.29l.2,2.82a1.18,1.18,0,0,1-1.25,1.53H13.88s-2,0-2-1.6V1.14S11.81,0,13.49,0h4.8S19.82-.09,19.88,1.29Z" />
        </g>
      </svg>
    );
  } else if (variant === "bathroom") {
    return (
      <svg
        height={23}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 100.07 99"
      >
        <path
          className="shower-icon"
          d="M100.07,51.37v6.24H95c-.7,17.58-9.52,25.12-17.67,28.32l6.28,9.28L78.49,98.7,71,87.7a32.57,32.57,0,0,1-7.66.5s0,.59-30.12,0a37.84,37.84,0,0,1-4.69-.39L21,99l-5.16-3.5,6.34-9.37C7.69,80.42,5.26,64.41,4.9,57.61H0V51.37H4.75V12.47A12.47,12.47,0,0,1,29.16,8.86a14.06,14.06,0,0,1,1.72-.1A14.4,14.4,0,0,1,44.94,20L19.43,31.9a14.38,14.38,0,0,1-2.84-7,14.76,14.76,0,0,1-.11-1.77A14.34,14.34,0,0,1,17.09,19a14.49,14.49,0,0,1,6.44-8.23,6.53,6.53,0,0,0-12.84,1.7v38.9Z"
        />
      </svg>
    );
  } else if (variant === "area") {
    return (
      <svg
        width={23}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 97.65 97.65"
      >
        <g id="icons">
          <path
            className=".bed-icon"
            d="M80,80,74.6,85.38a1.39,1.39,0,0,1-2,0,1.41,1.41,0,0,1,0-2L78,78,68,68,62.62,73.4a1.39,1.39,0,0,1-2,0,1.41,1.41,0,0,1,0-2L66,66,56,56l-5.39,5.39a1.39,1.39,0,0,1-2,0,1.41,1.41,0,0,1,0-2l5.39-5.39-10-10-5.39,5.39a1.4,1.4,0,0,1-2-2l5.39-5.39-10-10-5.39,5.39a1.4,1.4,0,1,1-2-2l5.39-5.39-9-9-5.39,5.39a1.39,1.39,0,0,1-2,0,1.41,1.41,0,0,1,0-2L19.1,19.1,0,0V97.65H97.65ZM16,83V39.77L59.17,83Z"
          />
        </g>
      </svg>
    );
  }
}

function getDescription(quantity: number, variant: string) {
  if (variant === "bedroom") {
    return quantity === 1 ? "1 Bedroom" : `${quantity} Bedrooms`;
  } else if (variant === "bathroom") {
    return quantity === 1 ? "1 Bathroom" : `${quantity} Bathrooms`;
  }
}