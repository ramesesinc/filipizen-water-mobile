import React from "react";
import { Text } from "react-native";

// interface CurrencyComponentProps {
//   amount: number | string;
//   currency?: string;
//   caption?: string;
//   classname?: string;
//   decimal?: number
// }

// const Currency: React.FC<CurrencyComponentProps> = ({
//   amount,
//   currency,
//   caption,
//   classname,
//   decimal = 2
// }) => {
//   const formattedAmount = () => {
//     const numericAmount =
//       typeof amount === "string" ? parseFloat(amount) : amount;

//     if (isNaN(numericAmount)) {
//       return "Invalid Amount";
//     }

//     const decimalPlaces = (numericAmount.toString().split(".")[1] || []).length;

//     const options = {
//       style: currency ? "currency" : "decimal",
//       currency: currency === "Php" || currency === "USD" ? currency : undefined,
//       minimumFractionDigits: decimal,
//       maximumFractionDigits: decimal,
//     };

//     const formattedValue = numericAmount.toLocaleString(undefined, options);

//     return formattedValue;
//   };

//   return (
//       <Text>{formattedAmount()}</Text>
//   );
// };

// export default Currency;

interface CurrencyFormatOptions {
    val: string | number;
    currency?: 'Php' | 'USD';
    decimal: number;
  }


export const currencyFormat = ({val, currency, decimal} : CurrencyFormatOptions) => {
    const numericAmount =
      typeof val === "string" ? parseFloat(val) : val;

    if (isNaN(numericAmount)) {
      return "Invalid Amount";
    }

    const options = {
      style: currency ? "currency" : "decimal",
      currency: currency === "Php" || currency === "USD" ? currency : undefined,
      minimumFractionDigits: decimal,
      maximumFractionDigits: decimal,
    };

    const formattedValue = numericAmount.toLocaleString(undefined, options);

    return formattedValue;
} 