const userArgs = process.argv.slice(2);

const Item = require("./models/item");
const Category = require("./models/category");

const items = [];
const categories = [];

const mongoose = require("mongoose");
mongoose.set("strictQuery", false);

const mongoDB = userArgs[0];

main().catch((err) => console.log(err));

async function main() {
	console.log("Debug: About to connect");
	await mongoose.connect(mongoDB);
	console.log("Debug: Should be connected?");
	await createItems();
	await createCategories();
	console.log("Debug: Closing mongoose");
	mongoose.connection.close();
}

async function itemCreate(index, name,  price, number_in_stock,description,category) {
	const itemdetail = { 
		name: name, 
		price: price,
		number_in_stock: number_in_stock,
		description: description
	};
	if(category !=false) itemdetail.category = category;

	const item = new Item(itemdetail);
	await item.save();
	items[index] = item;
	console.log(`Added item: ${name}`);
}

async function categoryCreate(index,name,description) {
	const category = new Category({name:name, description:description});
	await category.save();
	categories[index] = category;
	console.log(`Category added: ${name}`);
}

async function createCategories() {
	console.log("Adding categories");
	await Promise.all([
		categoryCreate(0, "Jeans","Everyday jeans for men"),
		categoryCreate(1, "Shoes","Casual shoes for men"),
		categoryCreate(2, "Coats","Coats for men"),
	]);
}

async function createItems() {
	console.log("Adding items");
	await Promise.all([
		itemCreate(0, "501 Jeans", 99, 100, "Classic blue Levi's 501 jeans for men",categories[0]),
		itemCreate(1, "Air Force One", 115, 10, "The famous red and black Nike shoe designed by Michael Jordan", categories[1]),
		itemCreate(2, "Cardigan", 150, 50, "A beige cardigan for rainy weather", categories[2]),
	]);
}