import { useEffect, useState } from "react";
import "./App.css";
import { Input } from "./components/ui/input";
import axios from "axios";

interface Product {
	id: number;
	store: string;
	loc: string;
	name: string;
	price: number;
}
function App() {
	const [location, setLocation] = useState<string>("");
	const [products, setProducts] = useState<Product[]>([]);
	const [storeLoc, setStoreLoc] = useState<string>("");

	
	useEffect(() => {
		console.log("Products scraped: ", products);
	}, [products]);

	const handleLocation = async (location: string) => {
		// sample location string: "Austin, TX 10382"
		const city_REGEX = /^([a-zA-Z ]+)/;
		const state_zip_REGEX = /(,[a-zA-Z \d ]+)/;
		
		const cityMatch = location.match(city_REGEX);
		const stateZipMatch = location.match(state_zip_REGEX);
		let city = cityMatch ? cityMatch[0] : "";

		let stateZip = stateZipMatch ? ((stateZipMatch[0]).substring(1)).trim() : ""; // clean up the stateZip i.e "CA 4056"
		const zip_REGEX = /[\d]+/;
		
		const stateMatch = stateZip.match(city_REGEX); // uses same regex as the city regex
		const zipMatch = stateZip.match(zip_REGEX);
		const state = stateMatch ? stateMatch[0].trim() : "";
		const zip = zipMatch ? zipMatch[0].trim() : "";

		console.log(state);
		console.log(zip);

		console.log("city: ", city);
		console.log(stateZip);
		console.log(state);
		console.log(zip);
		try {
			const resp = await axios.post("http://127.0.0.1:8000/grabGeolocation", {
				city: city,
				state: state,
				zip: zip,
			});

			const respProd: Product[] = resp["data"]["products"]; // gives me a list of json products
			respProd.sort((a, b) => a.price - b.price); // sort the products based on price
			setProducts(respProd);
			setStoreLoc(respProd[0].loc);

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

						<label>Shoppers</label>
						<label>{storeLoc}</label>
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
