exports.getMaxNumber = (arr, prop) => {
  if (arr?.length > 0) {
    if (prop) {
      let max = arr[0][prop]
      for (let i = 1; i < arr.length; i++) {
        if (arr[i][prop] > max) {
          max = arr[i][prop]
        }
      }
      return max
    } else {
      let max = arr[0]
      for (let i = 1; i < arr.length; i++) {
        if (arr[i] > max) {
          max = arr[i]
        }
      }
      return max
    }
  } else {
    return 0
  }
}
