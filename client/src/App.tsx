import { useEffect, useState } from "react";
import "./App.css";
import { Input } from "./components/ui/input";
import axios from "axios";

interface Product {
	id: number;
	name: string;
	price: number;
}
function App() {
	const [location, setLocation] = useState<string>("");
	const [products, setProducts] = useState<Product[]>([]);

	function comparePrices(prod: Product) {
		let a = prod.price;
		let b = prod.price;
		return a - b;
	  }

	useEffect(() => {
		console.log("Products scraped: ", products);
	}, [products]);

	const handleLocation = async (location: string) => {
		// sample location string: Austin%2C+Texas+73301
		// const city_REGEX = /^([a-zA-Z]+?)%2C/;
		// const state_REGEX = /\+([a-zA-Z]+)\+/;
		// const zip_REGEX = /\+([0-9]{5})/;
		const words = location.split(" ");
		console.log("words: ", words[0]);
		const city = words[0].substring(0, words[0].length - 1);
		const state = words[1];
		const zip = words[2];

		console.log("city: ", city);
		console.log("state: ", state);
		console.log("zip: ", zip);
		try {
			const resp = await axios.post("http://127.0.0.1:8000/grabGeolocation", {
				city: city,
				state: state,
				zip: zip,
			});

			const respProd: Product[] = resp["data"]["products"]; // gives me a list of json products
			respProd.sort((a, b) => a.price - b.price); // sort the products based on price
			setProducts(respProd);

			console.log("prod: ", respProd);
			console.log(resp);
		} catch (error) {
			console.log(error);
		}
	};
	return (
		<div className="bg-[#f5f5f5] h-screen w-full">
			<div className="flex flex-col gap-5 m-auto">
				<div className="flex flex-col justify-center items-center gap-3">
					<h1 className="text-red-500 text-4xl">Eggzit!</h1>
					<h3>Leave expensive eggs behind!</h3>
				</div>

				<div className="flex justify-center">
					<div className="flex flex-col">
						<label>City, State ZIP</label>
						<Input
							className="w-full mb-4 mt-1"
							value={location}
							onChange={(e) => setLocation(e.target.value)}
						></Input>
						<button
							className="cursor-pointer border border-black rounded-md px-1 py-1 bg-green-600 text-white"
							onClick={() => handleLocation(location)}
						>
							Eggsplore the prices!
						</button>

						<label>Grocery Store</label>
						<table className="border-separate border-spacing-x-7 border-spacing-y-2 border border-black rounded-2xl">
							<thead className="">
								<tr className="">
									<th>Name</th>
									<th>Price</th>
								</tr>
							</thead>
							<tbody className="">
								{products.map((item: Product) => {
									return (
										<tr key={item.id} className="">
											<td>{item.name}</td>
											<td>${item.price}</td>
										</tr>
									);
								})}
							</tbody>
						</table>
					</div>
				</div>
			</div>
		</div>
	);
}

export default App;
