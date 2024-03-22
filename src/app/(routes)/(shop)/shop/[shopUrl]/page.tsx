export default async function Shop({ params } : { params: { shopUrl: string }}) {
  return (
    <div>
      <h1>{params.shopUrl}</h1>
    </div>
  )
}