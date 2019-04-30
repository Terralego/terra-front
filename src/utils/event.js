// Prevent trigger parent onSubmit when press enter
export function preventEnterKeyPress (event) {
  if (event.key ===  'Enter') {
    event.preventDefault();
  }
}

export default { preventEnterKeyPress };
