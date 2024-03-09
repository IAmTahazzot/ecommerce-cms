'use client'

import { useEffect, useState } from 'react'

import { cn } from '@/lib/utils'

import { CaretSortIcon, CheckIcon } from '@radix-ui/react-icons'
import { BiPlus } from 'react-icons/bi'

import { Draggable, Droppable, DragDropContext } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { Variant } from './SingleVariant'

export interface Variants {
  sizes: {id: string; value: string}[]
  colors: {id: string; value: string}[]
  materials: {id: string; value: string}[]
}

interface VariantsProps {
  handleData: (variants: Variants) => void
}

export const Variants = ({ handleData }: VariantsProps) => {
  // TODO: Make sure to Disable it, if product is in editing mode & have any existing variantsUI
  const [showAddVariant, setShowAddVariant] = useState<boolean>(true)
  const [variants, setVariants] = useState<Variants>({
    sizes: [],
    colors: [],
    materials: [],
  });

  const [variantsUI, setVariantsUI] = useState<{ id: number }[]>([])

  const updateVariants = (type: keyof Variants, values: { id: string; value: string }[]) => {
    setVariants((prev) => ({
      ...prev,
      [type]: [...values],
    }));

    handleData(variants)
  }

  const addNewVariant = () => {
    if (variantsUI.length < 3) {
      setVariantsUI([...variantsUI, { id: Date.now() }])
    }
  }

  const removeVariant = (id: number, type?: keyof Variants) => {
    if (type) {
      // clear the variant values
      updateVariants(type, [])
    }

    // remove the variant from the UI
    setVariantsUI(variantsUI.filter((variant) => variant.id !== id))

    // It will remove the variant container only if there is no variant left
    // length is used 1 because the component is not rendered yet, so one variant left here means no variant
    // because the variant is begin removed before length is checked.
    if (variantsUI.length === 1) {
      setShowAddVariant(true)
    }
  }

  return (
    <>
      {showAddVariant ? (
        <Button
          type='button'
          variant={'link'}
          className='text-sm text-blue-500 flex items-center gap-x-1'
          onClick={() => {
            addNewVariant()
            setShowAddVariant(false)
          }}
        >
          <BiPlus className='h-4 w-4' />
          <span>Add option like size or color</span>
        </Button>
      ) : (
        <div
          className='bg-white rounded-xl border border-slate-200'
          aria-label='Variant container'
        >
          {variantsUI.map((variant, index) => (
            <div
              key={variant.id}
              className={cn(index !== 0 && 'border-t border-slate-200')}
            >
              <Variant
                variantId={variant.id}
                variants={variants}
                updateVariants={updateVariants}
                onDelete={removeVariant}
              />
            </div>
          ))}

          {variantsUI.length < 3 && (
            <div className='p-4'>
              <Button
                type={'button'}
                variant={'link'}
                className='text-sm text-blue-500 flex items-center px-0 gap-x-2'
                onClick={addNewVariant}
              >
                <BiPlus className='h-4 w-4' />
                <span>Add more options</span>
              </Button>
            </div>
          )}
        </div>
      )}
    </>
  )
}
