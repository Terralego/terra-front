// Prevent trigger parent onSubmit when press enter
export function onKeyPress (event) {
  if (event.key ===  'Enter') {
    event.preventDefault();
  }
}

export default { onKeyPress };
