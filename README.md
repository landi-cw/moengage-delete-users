# MoEngage User Deletion Tool

This Node.js script helps you delete users from your MoEngage CRM in bulk using a CSV file containing user IDs.

## Prerequisites

- Node.js installed (v14 or higher)
- MoEngage account with API access
- CSV file containing MoEngage user IDs

## Installation

1. Clone this repository
2. Install dependencies:
```bash
npm install
```

## Configuration

1. Create a `.env` file in the root directory with the following content:
```
API_KEY=your_api_key_here
API_URL=your_api_url
```

**Important Notes:**
- The API KEY and API URL must be from the same MoEngage account where you exported the users
- If you use different credentials, the script won't be able to find the users to delete

## Getting the User CSV File

To get the CSV file containing the users you want to delete:

1. Log in to your MoEngage account
2. Navigate to Segment
3. Click on "Create Segment"
4. Configure your segment criteria
5. Click on "Export Segment"
6. Save the downloaded CSV file as `users_to_delete.csv` in the project root directory

The CSV file must contain a column named `MoEngage_ID` with the user IDs you want to delete.

## Usage

Run the script:
```bash
npm start
```

The script will:
1. Read the CSV file
2. Process users in batches
3. Delete each user via the MoEngage API
4. Handle rate limits automatically (5,000 requests per minute)
5. Log the progress and any errors

## Error Handling

The script includes error handling for:
- Missing environment variables
- Invalid CSV format
- API rate limits
- Network errors
- Invalid API responses

## Rate Limiting

The script automatically handles MoEngage's rate limits:
- Processes up to 5,000 requests per minute
- Automatically pauses for 1 minute when rate limit is reached
- Resumes processing after the pause

## Testing

Run the test suite:
```bash
npm test
```

## Reference Documentation

For more information about the MoEngage User Deletion API, please refer to the official documentation:
[MoEngage Delete User API Documentation](https://developers.moengage.com/hc/en-us/articles/19988085160980-Delete-User?_gl=1*lppgey*_gcl_au*NTEyNjcxNTA5LjE3NDEzNzIxMDA.*FPAU*NTEyNjcxNTA5LjE3NDEzNzIxMDA.*_ga*MTc5NzEwMTAyMi4xNzI4NDA4NTE4*_ga_SEBHW7YTZ7*MTc0NjAxNzQ0NS4zMi4xLjE3NDYwMjc3OTguNTkuMC4w#h_01HCK7W2CT64RND73VAB35EXZX)

## License

ISC