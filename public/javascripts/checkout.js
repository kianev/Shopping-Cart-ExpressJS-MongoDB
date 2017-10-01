Stripe.setPublishableKey('pk_test_BVBKCu9Le28Wxy2fKtW5WcUJ');

let $form = $('#checkout-form')

$form.submit(function (event) {
  $('#charge-error').addClass('d-none')
  $form.find('button').prop('disabled', true)

  Stripe.card.createToken({
    number: $('#card-number').val(),
    cvc: $('#cvc').val(),
    exp_month: $('#exp-month').val(),
    exp_year: $('#exp-year').val(),
  }, stripeResponseHandler);
  return false
})

  function stripeResponseHandler (status, response) {

    if (response.error) {
      console.log(response.error)
      $('#charge-error').text(response.error.message)
      $('#charge-error').removeClass('d-none')
      $form.find('button').prop('disabled', false)


    } else {
      let token = response.id;

      // Insert the token into the form so it gets submitted to the server:
      $form.append($('<input type="hidden" name="stripeToken"/>').val(token))

      // Submit the form:
      $form.get(0).submit();

    }
    return false
  }

