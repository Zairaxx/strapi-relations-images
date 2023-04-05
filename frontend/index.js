let getPets = async () => {
  let response = await axios.post("http://localhost:1337/api/auth/local", {
    identifier: "Test",
    password: "Test1234",
  });
  let jwt = response.data.jwt;

  let user = await axios.get(
    "http://localhost:1337/api/users/me?populate=deep,3",
    {
      headers: {
        Authorization: `Bearer ${jwt}`,
      },
    }
  );
  console.log(user.data);
  let element = document.createElement("div");
  element.innerHTML = `<img src="http://localhost:1337${user.data.pets[0].profilePic.url}"></img>`;
  document.body.append(element);
};

getPets();

let addPet = async () => {
  //Hämtar ut filen och placerar den i en FormData
  let img = document.querySelector("#profilePic").files;
  let imgData = new FormData();
  imgData.append("files", img[0]);
  console.log(img);
  // Laddar upp filen i Strapi.
  await axios
    .post("http://localhost:1337/api/upload", imgData)
    .then((response) => {
      console.log(response);
      //Placerar den uppladdade filens ID i vårt nya djur vi vill lägga till.
      axios.post("http://localhost:1337/api/pets", {
        data: {
          name: "Bengt",
          profilePic: response.data[0].id,
          user: [1],
        },
      });
    });
};

document.querySelector("#addPet").addEventListener("click", addPet);
