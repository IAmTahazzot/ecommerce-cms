'use client'

import * as React from 'react'

import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'

import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Editor } from '@tinymce/tinymce-react'
import { Switch } from '@/components/ui/switch'
import { Checkbox } from '@/components/ui/checkbox'

import { Variants } from '@/components/Products/ProductVariants'

const ProductFormSchema = z.object({
  title: z.string().min(10).max(255),
  description: z.string().min(50).max(200000),
  status: z.boolean(),
  price: z.string().min(0),
  compareAtPrice: z.string().min(0),
  costPerItem: z.string().min(0),
  alwaysAvailable: z.boolean().default(false).optional(), // continue selling when out of stock
})

const AddProductPage = () => {
  const form = useForm({
    resolver: zodResolver(ProductFormSchema),
    defaultValues: {
      title: 'Sun Glasses',
      description:
        'Very useful for sunny days. Protects your eyes from UV rays.',
      status: true,
      price: '0',
      compareAtPrice: '0',
      costPerItem: '0',
      alwaysAvailable: false,
    },
  })

  const onSubmit = (values: z.infer<typeof ProductFormSchema>) => {
    // Toast.custom((t) => {
    //   return (
    //     <div className='p-4 bg-white rounded-xl max-w-[400px]'>
    //       <pre className='p-3 bg-slate-800 text-white rounded-xl'>
    //         <code>{JSON.stringify(values, null, 2)}</code>
    //       </pre>
    //     </div>
    //   )
    // })
    console.log(values)
  }

  return (
    <>
      {/* BEGIN: PAGE TITLE */}
      <div className='mt-4 grid grid-cols-6 gap-x-4'>
        <div className='col-span-4'>
          <h1 className='text-xl font-bold mb-6'>Add Product</h1>
        </div>
        <div className='col-span-2 flex items-center gap-x-2 justify-end'>
          <Button
            variant={'outline'}
            size={'lg'}
          >
            Draft
          </Button>
          <Button
            variant={'default'}
            size={'lg'}
            className='ml-2'
            onClick={form.handleSubmit(onSubmit)}
          >
            Save
          </Button>
        </div>
      </div>
      {/* END: PAGE TITLE */}

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className='mt-4 grid grid-cols-6 gap-x-8'>
            {/* BEGIN: LEFT SIDE */}
            <div className='col-span-4'>
              <div>
                <div className='bg-[--card-background] rounded-xl p-4'>
                  <FormItem>
                    <FormLabel htmlFor='title'>Title</FormLabel>
                    <FormControl>
                      <Input
                        id='title'
                        placeholder='Enter the title of the product'
                        {...form.register('title')}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.title?.message}
                    </FormMessage>
                  </FormItem>

                  <FormItem className='mt-6'>
                    <FormLabel htmlFor='description'>Description</FormLabel>
                    <FormDescription>
                      Describe the product in details. This will be displayed on
                      the product page. You can use markdown to format the text.
                    </FormDescription>
                    <FormControl>
                      <Editor
                        id='description'
                        apiKey='y4kcgqvxks2fksxeqt33hjv8b7evrvwjatpgz1d5ksyjcvf5'
                        initialValue={form.getValues('description')}
                        onEditorChange={(content, editor) => {
                          form.setValue('description', content)
                        }}
                        init={{
                          height: 300,
                          menubar: false,
                          plugins: [
                            'autoresize',
                            'advlist',
                            'autolink',
                            'lists',
                            'link',
                            'image',
                            'charmap',
                            'anchor',
                            'searchreplace',
                            'visualblocks',
                            'code',
                            'fullscreen',
                            'insertdatetime',
                            'media',
                            'table',
                            'preview',
                            'help',
                            'wordcount',
                          ],
                          toolbar:
                            'undo redo | blocks | ' +
                            'bold italic forecolor | alignleft aligncenter ' +
                            'alignright alignjustify | bullist numlist outdent indent | ' +
                            'removeformat | help',
                          content_style:
                            'body { font-family:Helvetica,Arial,sans-serif; font-size:14px }',
                        }}
                      />
                    </FormControl>
                    <FormMessage>
                      {form.formState.errors.description?.message}
                    </FormMessage>
                  </FormItem>
                </div>

                <div
                  aria-label='product price'
                  className='space-y-4 mt-6 bg-[--card-background] rounded-xl p-4'
                >
                  <h3 className='font-semibold text-sm'>Pricing and compare</h3>

                  <div className='flex items-center gap-x-2'>
                    <FormItem className=''>
                      <FormLabel htmlFor='price'>Price</FormLabel>
                      <FormControl>
                        <Input
                          id='price'
                          type='number'
                          placeholder='Enter the price of the product'
                          className='w-72'
                          {...form.register('price')}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.price?.message}
                      </FormMessage>
                    </FormItem>

                    <FormItem className=''>
                      <FormLabel htmlFor='compareAtPrice'>
                        Compare at price
                      </FormLabel>
                      <FormControl>
                        <Input
                          id='compareAtPrice'
                          type='number'
                          placeholder='Enter the compare at price of the product'
                          className='w-72'
                          {...form.register('compareAtPrice')}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.compareAtPrice?.message}
                      </FormMessage>
                    </FormItem>
                  </div>

                  <div>
                    <FormItem>
                      <FormLabel htmlFor='costPerItem'>
                        Cost per product
                      </FormLabel>
                      <FormControl>
                        <Input
                          id='costPerItem'
                          type='number'
                          placeholder='Cost per product item'
                          className='w-72'
                          {...form.register('costPerItem')}
                        />
                      </FormControl>
                      <FormMessage>
                        {form.formState.errors.costPerItem?.message}
                      </FormMessage>
                    </FormItem>
                  </div>
                </div>

                <div
                  aria-label='product price'
                  className='space-y-2 mt-6 bg-[--card-background] rounded-xl p-4'
                >
                  <h3 className='font-semibold text-sm'>Variants</h3>

                  <FormItem>
                    <Variants />
                  </FormItem>
                </div>

                <div
                  aria-label='product price'
                  className='space-y-2 mt-6 bg-[--card-background] rounded-xl p-4'
                >
                  <h3 className='font-semibold text-sm'>Availability</h3>

                  <div className='flex items-top space-x-2 py-3'>
                    <FormField
                      control={form.control}
                      name='alwaysAvailable'
                      render={({ field }) => (
                        <FormItem className='flex items-top gap-x-2 space-y-0'>
                          <FormControl>
                            <Checkbox
                              id='alwaysAvailable'
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>

                          <div className='space-y-2 leading-none'>
                            <label
                              htmlFor='alwaysAvailable'
                              className='text-sm font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70'
                            >
                              Continue selling when out of stock
                            </label>
                            <p className='text-muted-foreground text-sm'>
                              If this is unchecked, the product will be
                              unavailable for purchase when the inventory
                              reaches 0.
                            </p>
                          </div>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
              </div>

              <Button
                variant={'default'}
                type={'submit'}
                className='my-6'
              >
                Save
              </Button>
            </div>
            {/* END: LEFT SIDE */}

            {/* BEGIN: RIGHT SIDE */}
            <div className='col-span-2'>
              <div className='bg-[--card-background] rounded-xl p-4'>
                <FormItem className='flex items-center justify-between'>
                  <FormLabel htmlFor='status'>Status</FormLabel>
                  <FormControl>
                    <Switch
                      id='status'
                      {...form.register('status')}
                      onCheckedChange={(checked) => {
                        form.setValue('status', checked)
                      }}
                    />
                  </FormControl>
                </FormItem>
              </div>
            </div>
            {/* END: RIGHT SIDE */}
          </div>
        </form>
      </Form>
    </>
  )
}

export default AddProductPage