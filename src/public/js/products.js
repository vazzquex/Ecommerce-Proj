function addProductAlert(userEmail, productOwner) {

    if (userEmail === productOwner) {
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'You cannot add your own product to the cart!',
          })
    }else {
        Swal.fire({
            icon: 'success',
            title: 'Success',
            text: 'Product added to cart!',
          })
        
    }

}