module.exports = {
  getUserName: name => {
    return name.last_name ? `${name.first_name} ${name.last_name}` : name.first_name;
  },
  randomNumber: () => Math.floor(Math.random() * 10) + '',
}