module.exports.isInWishlistIds = (user, bookId) => {
  const { wishlist } = user;
  const found = wishlist !== undefined ? wishlist.find((id) => id.equals(bookId)) : false;
  if(found) {
    return true;
  }
  return false;
}

module.exports.getCartQuantiy = (user, bookId) => {
  const { cart } = user;
  const found = cart !== undefined ? cart.find(({ book }) => book.equals(bookId)) : false;
  if(found) {
    return found.quantity;
  }
  return false;
}