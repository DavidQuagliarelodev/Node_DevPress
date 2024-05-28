function validationDelete(event, form) {
  event.preventDefault();
  const response = confirm("Do you really want to delete this Article?");
  if (response) {
    form.submit();
  } else {
    console.log("not envied");
  }
}
