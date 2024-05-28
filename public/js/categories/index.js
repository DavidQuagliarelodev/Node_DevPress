function deleteSubmit(event, form){
    event.preventDefault()
    const response = confirm("Do you really want to delete this category?")
    if(response){
        form.submit()
    }else{
        console.log("Not Delete")
    }
}