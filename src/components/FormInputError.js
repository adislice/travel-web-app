
function FormInputError({errorState}) {
  return (<>
    {errorState && (
    <p className="text-sm text-red-600">{errorState.message}</p>
    )}
    </>
  )
}

export default FormInputError