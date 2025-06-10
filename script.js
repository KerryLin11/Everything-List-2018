document.addEventListener('DOMContentLoaded', function () {


    const masterListRange = 'Master List!A:F';
    const favouriteSongsRange = 'Favourite Songs SubList ~2023!A:M';
    const influentialMusicRange = '10 Most Influential Music Pieces!A:B';

    let originalValues = []; // Original spreadsheet fetch values

    async function fetchSheetData(range) {
        try {
            const response = await fetch(`/api/sheet?range=${encodeURIComponent(range)}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch data for range ${range}`);
            }
            return await response.json();
        } catch (error) {
            console.error(`Error fetching data for range ${range}:`, error);
            throw error;
        }
    }

    function fetchSublistData() {
        fetchSheetData(favouriteSongsRange)
            .then(data => {
                // console.log(data);
            })
            .catch(error => {
                // Handle error
            });
    }

    function fetchMusicData() {
        fetchSheetData(influentialMusicRange)
            .then(data => {
                // console.log(data);
            })
            .catch(error => {
                // Handle error
            });
    }

    //! Fetch and process Data
    function fetchListData() {
        fetchSheetData(masterListRange)
            .then(data => {
                console.log(data);
                originalValues = data.values;

                const filterButtonsContainer = document.getElementById('filter-buttons');
                const filterOptions = [
                    { id: 'best', label: 'Best' },
                    { id: 'worst', label: 'Worst' },
                    { id: 'recently-added', label: 'Recently Added' },
                    { id: 'movie', label: 'Movie' },
                    { id: 'anime', label: 'Anime' },
                    { id: 'manga', label: 'Manga' },
                    { id: 'game', label: 'Game' },
                    { id: 'book', label: 'Book' },
                    { id: 'short film', label: 'Short Film' },
                    { id: 'documentary', label: 'Documentary' },
                    { id: 'tv show', label: 'TV Show' },
                ];

                filterOptions.forEach(option => {
                    const button = document.createElement('button');
                    button.textContent = option.label;
                    button.classList.add('filter-button');
                    button.addEventListener('click', function () {
                        handleFilterClick(option.id);
                    });
                    filterButtonsContainer.appendChild(button);
                });

                renderTable(originalValues); // Render table with original values by default
            })
            .catch(error => {
                console.error('Error fetching data:', error);
                const container = document.getElementById('data-container');
                container.textContent = 'Error fetching data.';
            });
    }

    //! Render Table based on filtered values
    function renderTable(values) {
        const container = document.getElementById('data-container');
        container.innerHTML = ''; // Clear container

        if (values.length > 0) {
            const table = document.createElement('table');

            // Create the subheading row (first row)
            const subheadingRow = document.createElement('tr');
            values[0].forEach((cell, cellIndex) => {
                console.log(cellIndex + ' ' + cell);



                const th = document.createElement('th');
                th.textContent = cell;
                subheadingRow.appendChild(th);
            });
            table.appendChild(subheadingRow);

            // Render data rows (skip the subheading row)
            for (let i = 1; i < values.length; i++) {
                const row = values[i];
                const tr = document.createElement('tr');

                row.forEach((cell, cellIndex) => {
                    const td = document.createElement('td');
                    td.textContent = cell;

                    // Assign different colors based on 'type'
                    if (cellIndex === 1) { // Type is in the second column (index = 1)
                        const typeClass = cell.trim().toLowerCase().replace(/\s+/g, '-'); // Convert spaces to dashes
                        td.classList.add(typeClass); // Add css class based on type
                    }

                    tr.appendChild(td);
                });

                table.appendChild(tr);
            }

            container.appendChild(table);
        } else {
            container.textContent = 'No data found.';
        }
    }

    // Handle Button Events
    function handleFilterClick(filterId) {
        let filteredValues = [];

        switch (filterId) {
            case 'best':
                filteredValues = [...originalValues];
                break;
            case 'worst':
                filteredValues = [...originalValues];
                filteredValues.reverse();

                // Finds the subheading row, moves it to the top of array
                const subheading = filteredValues.find(row => row === originalValues[0]);
                if (subheading) {
                    filteredValues.splice(filteredValues.indexOf(subheading), 1); // Remove subheading from its current position (current pos = end of array)
                    filteredValues.unshift(subheading); // Add subheading back to top
                }
                break;
            case 'recently-added':
                // Copy original values array, skip the first row (subheading)
                filteredValues = originalValues.slice(1);
                filteredValues.sort((a, b) => b[0] - a[0]); // Sort by ID in descending order
                // Add back the subheading row at the beginning
                filteredValues.unshift(originalValues[0]);
                break;

            default:
                // Filter original values array starting from id 1 (exclude subheading)
                filteredValues = [originalValues[0], ...originalValues.slice(1).filter(row => {
                    const type = row[1].toLowerCase().trim();
                    return type === filterId;
                })];
                break;
        }

        renderTable(filteredValues);
    }


    fetchListData();

    fetchSublistData()
    fetchMusicData()
});
