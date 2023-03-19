import { SimpleGrid, SimpleGridProps } from "@chakra-ui/react";
import { Children, isValidElement, useMemo } from "react";

export const TicketsGrid = (props: SimpleGridProps) => {
  const columns = useMemo(() => {
    const count = Children.toArray(props.children).filter(
      isValidElement
    ).length;
    return {
      base: Math.min(2, 2),
      md: Math.min(3, 3),
      lg: Math.min(4, 4),
    };
  }, [props.children]);

  return (
    <SimpleGrid
      columns={columns}
      columnGap={{ base: "4", md: "6" }}
      rowGap={{ base: "8", md: "10" }}
      {...props}
    />
  );
};
