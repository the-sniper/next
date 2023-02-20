import { useRouter } from "next/router";

function Product() {
  const router = useRouter();
  const { productId } = router.query;
  return <div>Product {productId}</div>;
}
export default Product;
