function parseJUnitCDATA(cData:string, match:string) {
  const indexMatch = cData.indexOf(match);
  if (indexMatch === -1) {
    return '';
  }
  return cData.substring(indexMatch + match.length);
}

export default parseJUnitCDATA;
