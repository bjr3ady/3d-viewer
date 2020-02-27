const pics = () => {
  let urls = []
  for (let i = 1; i <= 150; i++) {
    if (i < 10) {
      urls.push(require(`./000${i}.png`))
    }
    else if (10 <= i && i < 100) {
      urls.push(require(`./00${i}.png`))
    } else if (100 <= i && i < 10000) {
      urls.push(require(`./0${i}.png`))
    }
  }
  return urls
}

export default pics()