export default function CartPage() {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <div className="bg-white rounded-lg shadow p-4">
        <div className="text-center text-gray-600">
          <p className="mb-2">Your cart is empty</p>
          <p className="text-sm">Add items to your cart to see them here</p>
        </div>
      </div>
    </div>
  );
}
