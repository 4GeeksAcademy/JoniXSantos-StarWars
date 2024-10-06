const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			message: null,
			demo: [
				{
					title: "FIRST",
					background: "white",
					initial: "white"
				},
				{
					title: "SECOND",
					background: "white",
					initial: "white"
				}
			],
			host: 'https://playground.4geeks.com/contact',
			hostSW: 'https://swapi.tech/api',
			slug: 'jonicruz',
			user: '',
			isLogged: false,
			characters: [],
			characterDetails: {},
			planets: [],
			planetDetails: {},
			starships: [],
			starshipDetails: {},
			contacts: [],
			currentContact: {},
			favorites: []
		},
		actions: {
			// Use getActions to call a function within a fuction
			exampleFunction: () => {
				getActions().changeColor(0, "green");
			},

			getMessage: async () => {
				try{
					// fetching data from the backend
					const resp = await fetch(process.env.BACKEND_URL + "/api/hello")
					const data = await resp.json()
					setStore({ message: data.message })
					// don't forget to return something, that is how the async resolves
					return data;
				}catch(error){
					console.log("Error loading message from backend", error)
				}
			},
			changeColor: (index, color) => {
				//get the store
				const store = getStore();

				//we have to loop the entire demo array to look for the respective index
				//and change its color
				const demo = store.demo.map((elm, i) => {
					if (i === index) elm.background = color;
					return elm;
				});

				//reset the global store
				setStore({ demo: demo });
			},
			signUp: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/users`;
				const options = {
					method: 'POST',
					headers: {
						"Content-Type": 'application/json'
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error', response.status, response.statusText)
					return
				};
				response.json();
			},
			login: async (dataToSend) => {
				const uri = `${process.env.BACKEND_URL}/api/login`;
				const options = {
					method: 'POST',
					headers: {
						"Content-Type": 'application/json'
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error', response.status, response.statusText)
					return false
				};
				const data = await response.json();
				localStorage.setItem('token', data.access_token);
				localStorage.setItem('user', JSON.stringify(data.results));
				setStore({ isLogged: true, user: data.results.email });
				return true
			},
			accessProtected: async () => {
				const token = localStorage.getItem('token');
				const uri = `${process.env.BACKEND_URL}/api/protected`;
				const options = {
					method: 'GET',
					headers: {
						"Content-Type": 'application/json',
						"Authorization": `Bearer ${token}`
					}
				};
				const response = await fetch(uri, options)
				if (!response.ok) {
					console.log('Error', response.status, response.statusText)
					return
				};
				const data = await response.json();
				console.log(data)
			},
			isLogged: () => {
				const token = localStorage.getItem('token');
				if (token) {
					const userData = JSON.parse(localStorage.getItem('user'));
					setStore({ isLogged: true, user: userData.email })
				}
			},
			logout: () => {
				setStore({ isLogged: false, user: '' });
				localStorage.removeItem('token');
				localStorage.removeItem('user')
			},
			getCharacters: async () => {
				const uri = `${getStore().hostSW}/people`;
				const response = await fetch(uri);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return;
				};
				const data = await response.json();
				setStore({ characters: data.results })
			},
			getCharacterDetails: async (id) => {
				const uri = `${getStore().hostSW}/people/${id}`;
				const response = await fetch(uri);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return;
				};
				const data = await response.json();
				setStore({ characterDetails: data.result.properties })
			},
			clearCharacterDetails: () => {
				setStore({ characterDetails: {} });
			},
			getPlanets: async () => {
				const uri = `${getStore().hostSW}/planets`;
				const response = await fetch(uri);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return;
				};
				const data = await response.json();
				setStore({ planets: data.results })
			},
			getPlanetDetails: async (id) => {
				const uri = `${getStore().hostSW}/planets/${id}`;
				const response = await fetch(uri);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return;
				};
				const data = await response.json();
				setStore({ planetDetails: data.result.properties })
			},
			clearPlanetDetails: () => {
				setStore({ planetDetails: {} });
			},
			getStarships: async () => {
				const uri = `${getStore().hostSW}/starships`;
				const response = await fetch(uri);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return;
				};
				const data = await response.json();
				setStore({ starships: data.results })
			},
			getStarshipDetails: async (id) => {
				const uri = `${getStore().hostSW}/starships/${id}`;
				const response = await fetch(uri);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return;
				};
				const data = await response.json();
				setStore({ starshipDetails: data.result.properties })
			},
			clearStarshipDetails: () => {
				setStore({ starshipDetails: {} });
			},
			addToFavorites: (item) => {
				const updatedFavorites = [...getStore().favorites, item]
				setStore({ favorites: updatedFavorites });
			},
			removeFromFavorites: (item) => {
				const updatedFavorites = getStore().favorites.filter(currentItem => currentItem.name !== item.name);
				setStore({ favorites: updatedFavorites });
			},
			getContacts: async () => {
				const uri = `${getStore().host}/agendas/${getStore().slug}/contacts`;
				const response = await fetch(uri);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return;
				};
				const data = await response.json();
				setStore({ contacts: data.contacts })
			},
			addContact: async (dataToSend) => {
				const uri = `${getStore().host}/agendas/${getStore().slug}/contacts`;
				const options = {
					method: 'POST',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return;
				};
				getActions().getContacts();
			},
			editContact: async (item, dataToSend) => {
				const uri = `${getStore().host}/agendas/${getStore().slug}/contacts/${item.id}`;
				const options = {
					method: 'PUT',
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify(dataToSend)
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return;
				}
				getActions().getContacts();
			},
			deleteContact: async (item) => {
				const uri = `${getStore().host}/agendas/${getStore().slug}/contacts/${item.id}`;
				const options = {
					method: 'DELETE',
					headers: {
						"Content-Type": "application/json"
					}
				};
				const response = await fetch(uri, options);
				if (!response.ok) {
					console.log('Error: ', response.status, response.statusText);
					return;
				}
				getActions().getContacts();
			}
		}
	};
};

export default getState;
