var input = prompt()
var data = {
    input: 'userinput'
}

fetch('192.168.0.1:1333/secretauth', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json' // Specify the content type if sending JSON data
      // Add other headers if needed
    },
    body: JSON.stringify(data) // Convert the data to JSON format
  })
