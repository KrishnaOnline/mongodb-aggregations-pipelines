use('aggregs')

db.users.aggregate(
    [
        {
          $group: {
            _id: "$favoriteFruit",
            countFruits: {
              $sum: 1   // means, adds "1" to individuals, when found...
            }
          }
        },
        {
          $sort: {
            countFruits: -1   // -1 means desc, and 1 means asc order...
          }
        },
        {
          $limit: 2
        }
    ]
)