

/**
 * 
 * @param {*} qa - is an object like "answers": {
                "5361312": {
                    "id": 5361312,
                    "body": "What's love got to do with my emotions",
                    "date": "2022-03-11T00:00:00.000Z",
                    "answerer_name": "sata5pa3da",
                    "helpfulness": 2,
                    "photos": []
                }
            }
 * @returns sorted array of answers like [{
                    "id": 5361312,
                    "body": "What's love got to do with my emotions",
                    "date": "2022-03-11T00:00:00.000Z",
                    "answerer_name": "sata5pa3da",
                    "helpfulness": 2,
                    "photos": []
                }]
 */
export const sortBySeller = (qa) =>
    Object.values(qa.answers).sort((a, b) => {
        if (a.answerer_name === 'Seller') {
            return -1;
        } else if (b.answerer_name === 'Seller') {
            return 1;
        }

        return 0;
    });