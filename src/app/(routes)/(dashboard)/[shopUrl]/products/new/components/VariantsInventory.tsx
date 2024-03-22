"use client";

import { Variants } from "@/components/Products/ProductVariants";
import { GoEye, GoEyeClosed} from 'react-icons/go'
import {
  KeyGetter,
  compareAndUpdateVariants,
  compareVariantProps,
  generateVariants,
  groupBy,
  linearData,
} from "@/lib/products";
import { useState, useEffect, use, ReactNode } from "react";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  TableHeader,
  Table,
  TableBody,
  TableRow,
  TableCell,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface VariantsInventoryProps {
  variants: Variants;
  updateVariants: React.Dispatch<React.SetStateAction<any>>;
}

export const VariantsInventory = ({ variants, updateVariants }: VariantsInventoryProps) => {
  const [inventory, setInventory] = useState<compareVariantProps[]>([]);
  const [sortBy, setSortBy] = useState<"size" | "color" | "material">();
  const [inventoryUi, setInventoryUi] = useState<
    Record<string, compareVariantProps[]>
  >({});
  const [showInventory, setShowInventory] = useState(true);

  useEffect(() => {
    let filteredVariants: { [key: string]: string[] } = {}; // Add index signature to Variants type
    for (const variant in variants) {
      if (variants[variant as keyof Variants].length > 0) {
        // Use keyof Variants to access variant
        filteredVariants[variant.slice(0, -1)] = variants[
          variant as keyof Variants
        ]
          .map((v) => v.value)
          .filter((v) => v !== "");
      }
    }

    // check if filteredVariants is empty
    if (Object.keys(filteredVariants).length === 0) {
      return;
    }

    const newGeneratedVariants: compareVariantProps[] = generateVariants(
      filteredVariants
    ).map((v) => {
      // check if it exist in old inventory
      const matchedIndex = inventory.findIndex((inv) => {
        return (
          inv.color === v.color &&
          inv.size === v.size &&
          inv.material === v.material
        );
      });

      return {
        ...v,
        inventory: matchedIndex > -1 ? inventory[matchedIndex].inventory : 0,
        price: matchedIndex > -1 ? inventory[matchedIndex].price : 0,
      };
    }) as compareVariantProps[];

    const { updatedVariants, deletedVariants } = compareAndUpdateVariants(
      inventory,
      newGeneratedVariants
    );
    setInventory(updatedVariants);
  }, [variants]);

  if (!sortBy) {
    if (variants.sizes.length > 0) {
      setSortBy("size");
    } else if (variants.colors.length > 0) {
      setSortBy("color");
    } else if (variants.materials.length > 0) {
      setSortBy("material");
    }
  }

  useEffect(() => {
    const inventoryUiGroup = groupBy(inventory, (inventory) => {
      if (sortBy === "size") return inventory.size;
      if (sortBy === "material") return inventory.material;
      return inventory.color;
    });

    setInventoryUi(inventoryUiGroup);
  }, [inventory, sortBy]);

  useEffect(() => {
    updateVariants(inventory)
  }, [inventory, updateVariants])

  return (
    <div className="mt-4 border rounded p-4">
      <div className="flex items-start justify-between mb-6">
        <Select
          onValueChange={(value: string) => setSortBy(value as typeof sortBy)}
        >
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Group by" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {variants.colors.length > 0 && (
                <SelectItem value="color">Color</SelectItem>
              )}
              {variants.sizes.length > 0 && (
                <SelectItem value="size">Size</SelectItem>
              )}
              {variants.materials.length > 0 && (
                <SelectItem value="material">Material</SelectItem>
              )}
            </SelectGroup>
          </SelectContent>
        </Select>
        <Button
          type="button"
          variant={"ghost"}
          size={"icon"}
          onClick={() => {
            setShowInventory(!showInventory);
          }}
        >
          {showInventory ? <GoEyeClosed size={14} /> : <GoEye size={14} />}
        </Button>
      </div>

      <Table className={cn("w-full", showInventory ? "block" : "hidden")}>
        <TableHeader>
          <TableRow>
            <TableCell>Variant</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Inventory</TableCell>
          </TableRow>
        </TableHeader>
        <TableBody>
          {Object.keys(inventoryUi).map((key, index) => {
            let VariantGroup: ReactNode[] = [
              <TableRow key={index} className="border-none">
                <TableCell colSpan={3}>
                  <div className="bg-black text-white rounded-full py-1 px-3 text-center w-fit">
                    {key}
                  </div>
                </TableCell>
              </TableRow>,
            ];

            let VarintGroupList = inventoryUi[key].map((variant) => {
              return (
                <TableRow
                  key={variant.color + variant.size + variant.material}
                  className="border-none"
                >
                  <TableCell>
                    <div className="bg-neutral-100 rounded-lg p-1 text-xs flex-[0_0_150px] text-center">
                      {`${variant.color ? variant.color + ", " : ""}
                         ${variant.size ? variant.size + ", " : ""}
                         ${variant.material ? variant.material : ""}`.replace(
                        /,\s*$/,
                        ""
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <Input
                      value={variant.price}
                      onChange={(e) => {
                        const newInventory = inventory.map((i) => {
                          if (
                            i.color === variant.color &&
                            i.size === variant.size &&
                            i.material === variant.material
                          ) {
                            return {
                              ...i,
                              price: parseInt(e.target.value), // Convert the value to a number
                            };
                          }
                          return i;
                        });
                        setInventory(newInventory);
                      }}
                    />
                  </TableCell>
                  <TableCell>
                    <Input
                      value={variant.inventory}
                      onChange={(e) => {
                        const newInventory = inventory.map((i) => {
                          if (
                            i.color === variant.color &&
                            i.size === variant.size &&
                            i.material === variant.material
                          ) {
                            return {
                              ...i,
                              inventory: parseInt(e.target.value), // Convert the value to a number
                            };
                          }
                          return i;
                        });
                        setInventory(newInventory);
                      }}
                    />
                  </TableCell>
                </TableRow>
              );
            });

            return [...VariantGroup, ...VarintGroupList];
          })}
        </TableBody>
      </Table>
    </div>
  );
};
