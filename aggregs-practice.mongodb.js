use("aggregs");

// 1) count active users...
db.users.aggregate([
	{
		$match: {
			isActive: true,
		},
	},
	{
		$count: "activeUsers",
	},
]);

// 2) average age of all users...
db.users.aggregate([
	{
		$group: {
			_id: null, // if given "$gender", gives data of male and female genders
			// _id: "$gender",
			averageAge: {
				$avg: "$age",
			},
		},
	},
]);

// 3) top n fav fruits...
db.users.aggregate([
	{
		$group: {
			_id: "$favoriteFruit",
			countFruits: {
				$sum: 1, // means, adds "1" to individuals, when found...
			},
		},
	}, // groups all the fav fruits by above stage-1...
	{
		$sort: {
			countFruits: -1, // -1 means desc, and 1 means asc order...
		},
	},
	{
		$limit: 2,
	},
]);

// 4) find the total number of male and female users...
db.users.aggregate([
	{
		$group: {
			_id: "$gender",
			countGenders: {
				$sum: 1,
			},
		},
	},
]);

// 5) no. of users in different countries...
db.users.aggregate([
	{
		$group: {
			_id: "$company.location.country",
			usersInCountries: {
				$sum: 1,
			},
		},
	},
]);

// 6) which country has highest no. of users...
db.users.aggregate([
	{
		$group: {
			_id: "$company.location.country",
			usersInCountries: {
				$sum: 1,
			},
		},
	},
	{
		$sort: {
			usersInCountries: -1,
		},
	},
	{
		$limit: 1,
	},
]);

// 8) list all unique eye colors present in the collection then count...
db.users.aggregate([
	{
		$group: {
			_id: "$eyeColor",
		},
	},
	{
		$count: "noOfEysColors",
	},
]);

// 9) avg no. of tags per user...
db.users.aggregate([
	{
		$unwind: {
			path: "$tags",
		},
	},
	{
		$group: {
			_id: "$_id",
			noOfTags: {
				$sum: 1,
			},
		},
	},
	{
		$group: {
			_id: null,
			avgTagsPerUser: {
				$avg: "$noOfTags",
			},
		},
	},

	// OR
	/*[
		{
			$addFields: {
				noOfTags: {
					$size: {
						$ifNull: ["$tags", []],
					},
				},
			},
		},
		{
			$group: {
				_id: null,
				avgTagsPerUser: {
					$avg: "$noOfTags",
				},
			},
		},
	],*/
]);

// 10) how many users have "enim" as one of their tag...
db.users.aggregate([
	{
		$match: {
			tags: "enim",
		},
	},
	{
		$count: "usersWithEnimTag",
	},
]);

// 11) list names and age of users who are inactive and have "velit" as a tag...
db.users.aggregate([
	{
		$match: {
			isActive: false,
			tags: "velit",
		},
	},
	{
		$project: {
			name: 1, // 1 means to include the attribute in results...
			age: 1,
		},
	},
	// {
	//     $count: 'totalResults'
	// }
]);

// 12) no. of users with phone number starting with "+1 (940)"...
db.users.aggregate([
	{
		$match: {
			"company.phone": /^\+1 \(940\)/,
		},
	},
	{
		$count: "totalResults",
	},
]);

// 13) list who registered most recently...
db.users.aggregate([
	{
		$sort: {
			registered: -1,
		},
	},
	{
		$limit: 4,
	},
	{
		$project: {
			name: 1,
			registered: 1,
			age: 1,
		},
	},
]);

// 14) categorize users by their fav fruits...
db.users.aggregate([
	{
		$group: {
			_id: "$favoriteFruit",
			resUsers: {
				$push: "$name",
			},
		},
	},
]);

// 15) how many users have "ad" as their 2nd tag in list of tags...
db.users.aggregate([
	{
		$match: {
			"tags.1": "ad", // .1 refers to 1st index...
		},
	},
	{
		$count: "totalResults",
	},
]);

// 16) find users who has both "enim" and "id" in their tags...
db.users.aggregate([
	{
		$match: {
			tags: {
				$all: ["enim", "id"],
			},
		},
	},
]);

// 17) list all the companies located in USA with their corresponding user count...
db.users.aggregate([
	{
		$match: {
			"company.location.country": "USA",
		},
	},
	{
		$group: {
			_id: "$company.title",
			// _id: null,
			userCount: {
				$sum: 1,
			},
		},
	},
]);

// 18) get author details from author_id, using lookup operator...
db.books.aggregate([
	{
		$lookup: {
			from: "authors",
			localField: "author_id",
			foreignField: "_id",
			as: "author_details",
		},
	},
	{
		$addFields: {
			author_details: {
				// $first: "$author_details"
				$arrayElemAt: ["$author_details", 0],
			},
		},
	},
]);
