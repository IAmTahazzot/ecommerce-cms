import { cn } from '@/lib/utils'

import React from 'react'

import { BsTrash3 } from 'react-icons/bs'
import { RiDraggable } from 'react-icons/ri'
import { CgDanger } from 'react-icons/cg'

import { Draggable, Droppable, DragDropContext } from '@hello-pangea/dnd'
import { Button } from '@/components/ui/button'
import { Variants } from './ProductVariants'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Input } from '@/components/ui/input'

interface VariantProps {
  variantId: number
  variants: Variants
  onDelete: (id: number, type?: keyof Variants) => void
  updateVariants: (
    type: keyof Variants,
    values: { id: string; value: string }[]
  ) => void
}

export const Variant = ({
  variantId,
  variants,
  updateVariants,
  onDelete,
}: VariantProps) => {
  const [editing, setEditing] = React.useState(true)

  const [selectedVariantType, setSelectedVariantType] =
    React.useState<keyof Variants>()
  const [selectedVariantValues, setSelectedVariantValues] = React.useState<
    { id: string; value: string }[]
  >([])
  const [duplicateVariant, setDuplicateVariant] = React.useState<string[]>([])
  const [error, setError] = React.useState({
    status: false,
    message: '',
  })

  const AvailableVariants = Object.keys(variants).filter((variantKey) => {
    return !variants[variantKey as keyof Variants].length
  })

  const handleValuesDragEnd = (result: any) => {
    if (!result.destination) return
    const items = Array.from(selectedVariantValues)
    const [reorderedItem] = items.splice(result.source.index, 1)
    items.splice(result.destination.index, 0, reorderedItem)
    setSelectedVariantValues(items)
  }

  if (editing) {
    return (
      <div
        className='p-4 rounded-xl'
        aria-label='variant'
      >
        <div className='grid grid-cols-[40px_1fr_40px] gap-2'>
          <span className='col-start-2 row-start-1 self-center block text-sm font-medium'>
            Option name
          </span>

          <RiDraggable className='row-start-2 col-start-1 self-center justify-self-center h-4 w-4' />

          <div className='col-start-2 row-start-2'>
            <Select
              value={selectedVariantType}
              onValueChange={(result: keyof Variants) => {
                setSelectedVariantType(result)

                // create an empty value for the selected variant type
                setSelectedVariantValues([
                  {
                    id: Math.random().toString(36),
                    value: '',
                  },
                ])

                if (!AvailableVariants.includes(result)) {
                  setError({
                    status: true,
                    message: result + ' is already selected',
                  })
                } else {
                  setError({
                    status: false,
                    message: '',
                  })
                }
              }}
            >
              <SelectTrigger>
                <SelectValue placeholder='Select a variant' />
              </SelectTrigger>
              <SelectContent>
                {Object.keys(variants).map((variantType, index) => (
                  <SelectItem
                    key={index}
                    value={variantType}
                  >
                    {variantType.at(0)?.toUpperCase() + variantType.slice(1)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error.status && (
            <p className='row-start-3 col-start-2 text-xs text-red-500 font-medium mt-3'>
              {error.message}
            </p>
          )}

          <Button
            variant={'ghost'}
            onClick={() => {
              if (selectedVariantType) {
                onDelete(variantId, selectedVariantType)
              } else {
                onDelete(variantId)
              }
            }}
            type='button'
            className='h-full px-0 col-start-3 row-start-2'
          >
            <BsTrash3 className='h-4 w-4' />
          </Button>
        </div>

        {/* BEGIN: Creating option values */}
        {selectedVariantType && !error.status && (
          <div className='block mt-5'>
            <DragDropContext onDragEnd={handleValuesDragEnd}>
              <Droppable droppableId={selectedVariantType}>
                {(provided) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.droppableProps}
                  >
                    <span className='ml-12 col-start-2 block pb-2 text-sm font-medium'>
                      Option values
                    </span>

                    {selectedVariantValues.map((variantValue, index) => (
                      <Draggable
                        key={variantValue.id}
                        draggableId={variantValue.id}
                        index={index}
                      >
                        {(provided) => (
                          <div
                            key={index}
                            className='grid grid-cols-[40px_1fr_40px] gap-x-2 mb-2'
                            ref={provided.innerRef}
                            {...provided.draggableProps}
                          >
                            {selectedVariantValues[index].value.length !== 0 ? (
                              <div
                                className={cn(
                                  'col-start-1 self-center justify-self-end h-4 w-4',
                                  index === 0
                                    ? 'row-start-2'
                                    : 'row-start-' + (index + 2)
                                )}
                                {...provided.dragHandleProps}
                              >
                                <RiDraggable className='h-full w-full' />
                              </div>
                            ) : (
                              <div
                                className='hidden'
                                {...provided.dragHandleProps}
                              ></div>
                            )}

                            <Input
                              className={cn(
                                'col-start-2',
                                index === 0
                                  ? 'row-start-2'
                                  : 'row-start-' + (index + 2),
                                duplicateVariant.includes(variantValue.id) && 'border-red-500 focus-visible:ring-red-500'
                              )}
                              value={variantValue.value}
                              onChange={(e) => {
                                const newValues = [...selectedVariantValues]
                                newValues[index].value = e.target.value
                                setSelectedVariantValues(newValues)
                                if (
                                  index === selectedVariantValues.length - 1 &&
                                  e.target.value !== ''
                                ) {
                                  setSelectedVariantValues((prev) => {
                                    return [
                                      ...prev,
                                      {
                                        id: Math.random().toString(36),
                                        value: '',
                                      },
                                    ]
                                  })
                                }

                                // check if the value is already in the list then add this id to the duplicateVariant
                                const isDuplicate =
                                  selectedVariantValues.filter(
                                    (variant) =>
                                      variant.value === e.target.value
                                  )

                                if (
                                  isDuplicate.length > 1 &&
                                  e.target.value !== ''
                                ) {
                                  setDuplicateVariant((prev) => {
                                    return [...prev, variantValue.id]
                                  })
                                } else {
                                  setDuplicateVariant((prev) =>
                                    prev.filter((id) => id !== variantValue.id)
                                  )
                                }
                              }}
                              onBlur={() => {
                                updateVariants(
                                  selectedVariantType,
                                  selectedVariantValues
                                )
                              }}
                            />
                            {selectedVariantValues.length > 2 &&
                              selectedVariantValues[index].value.length !==
                                0 && (
                                <Button
                                  variant={'ghost'}
                                  type='button'
                                  className={cn(
                                    'h-full px-0 col-start-3',
                                    index === 0
                                      ? 'row-start-2'
                                      : 'row-start-' + (index + 2)
                                  )}
                                  onClick={() => {
                                    const newValues = [...selectedVariantValues]
                                    newValues.splice(index, 1)
                                    setSelectedVariantValues(newValues)
                                  }}
                                >
                                  <BsTrash3 className='h-4 w-4' />
                                </Button>
                              )}

                            {duplicateVariant.includes(variantValue.id) && (
                              <div className='col-start-2 row-start-3 text-xs text-red-500 font-medium py-2'>
                                <CgDanger className='h-4 w-4 inline-block' /> {' '}
                                <span className='font-bold'>
                                  {variantValue.value}
                                </span>{' '}
                                is already exist!
                              </div>
                            )}
                          </div>
                        )}
                      </Draggable>
                    ))}
                    {provided.placeholder}
                  </div>
                )}
              </Droppable>
            </DragDropContext>

            <div className='grid grid-cols-[40px_1fr_40px] gap-2 mt-4'>
              <Button
                type={'button'}
                variant={'outline'}
                size={'sm'}
                className='col-start-2 w-[60px] text-sm flex items-center gap-x-2'
                onClick={() => {
                  // remove all empty values
                  const newValues = selectedVariantValues.filter(
                    (variantValue) => variantValue.value !== ''
                  )
                  setSelectedVariantValues(newValues)
                  updateVariants(selectedVariantType, selectedVariantValues)
                  setEditing(false)
                }}
              >
                Done
              </Button>
            </div>
          </div>
        )}
        {/* END: Creating option values */}
      </div>
    )
  }

  if (!editing) {
    return (
      <div
        className='p-4 rounded-xl'
        aria-label='variant'
      >
        <div className='grid grid-cols-[40px_1fr_40px] gap-2'>
          <RiDraggable className='col-start-1 row-start-1 self-center justify-self-center h-4 w-4' />
          <span className='col-start-2 row-start-1 self-center block text-sm font-medium'>
            {selectedVariantType &&
              selectedVariantType?.charAt(0).toUpperCase() +
                selectedVariantType?.slice(1)}
          </span>
          <Button
            variant={'ghost'}
            onClick={() => {
              // remove all empty values
              const newValues = selectedVariantValues.filter(
                (variantValue) => variantValue.value !== ''
              )
              setSelectedVariantValues(newValues)
              setEditing(true)
            }}
            type='button'
            className='h-full px-0 col-start-3 row-start-1'
          >
            edit
          </Button>

          <div className='row-start-2 col-start-2 py-2 flex items-center gap-x-2'>
            {selectedVariantValues.map((variantValue, index) => (
              <span
                key={index}
                className='block text-sm font-medium bg-slate-100 rounded-full py-2 px-4'
              >
                {variantValue.value}
              </span>
            ))}
          </div>
        </div>
      </div>
    )
  }
}
