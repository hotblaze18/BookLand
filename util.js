module.exports.isInWishlistIds = (user, bookId) => {
  const { wishlist } = user;
  const found = wishlist !== undefined ? wishlist.find((id) => id.equals(bookId)) : false;
  if(found) {
    return true;
  }
  return false;
}