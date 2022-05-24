import React, { useContext, useEffect, useState } from 'react';
import { Box, Button, Heading, HStack, Menu, MenuButton, MenuItem, MenuList, VStack } from '@chakra-ui/react';
import { BsChevronDown } from 'react-icons/bs';
import _ from 'lodash';
import DataTable, { Media } from 'react-data-table-component';
import { UserContext } from '../contexts/UserContext';
import { getJobTypeListEventType } from '../controller/jobType';
import { getEventTypeList } from '../controller/eventType';
import { EventType } from '../../../src/typedefs/eventType';
import { JobType } from '../../../src/typedefs/jobType';
import SignupSheetJobsRow from './SignupSheetJobsRow';

function EventSignupSheet() {
    const { state } = useContext(UserContext);

    const [eventTypes, setEventTypes] = useState<EventType[]>();
    const [selectedEventType, setSelectedEventType] = useState<string>('Race');
    const [eventJobTypes, setEventJobTypes] = useState<JobType[]>();

    async function getEventTypeData() {
        if (selectedEventType) {
            const jobs = (await getJobTypeListEventType(state.token, selectedEventType)) as JobType[];
            jobs.sort((a, b) => {
                const jobDayDiff = a.jobDayNumber - b.jobDayNumber;
                if (jobDayDiff === 0) {
                    return (a.sortOrder - b.sortOrder);
                }
                return jobDayDiff;
            });
            setEventJobTypes(jobs);
        }
    }

    // get the API data from the jobType API
    useEffect(() => {
        async function getData() {
            const eventTypeList = (await getEventTypeList(state.token)) as EventType[];
            setEventTypes(eventTypeList);
        }
        getData();
    }, []);

    useEffect(() => {
        getEventTypeData();
    }, [selectedEventType]);

    // Put it in a table
    const rowCallbackProp = {
        refreshData: async () => {
            await getEventTypeData();
        },
    };

    return (
        <VStack>
            <HStack>
                <Heading>
                    {`Job Structure for ${selectedEventType}`}
                </Heading>
                <Menu>
                    <MenuButton bg="orange" color="white" as={Button} rightIcon={<BsChevronDown />} />
                    <MenuList>
                        {
                            _.map(eventTypes, (listEvent) => (
                                <MenuItem key={listEvent.type} onClick={() => setSelectedEventType(listEvent.type)}>
                                    {listEvent.type}
                                </MenuItem>
                            ))
                        }
                    </MenuList>
                </Menu>
            </HStack>
            <DataTable
                columns={
                    [
                        {
                            name: 'Title',
                            selector: (row: JobType) => `${row.title} (id: ${row.jobTypeId})`,
                            sortable: true,
                            maxWidth: '150',
                            wrap: true,
                        },
                        {
                            name: 'Points',
                            selector: (row: JobType) => row.pointValue,
                            sortable: true,
                            maxWidth: '50',
                        },
                        {
                            name: 'Cash',
                            selector: (row: JobType) => row.cashValue,
                            sortable: true,
                            maxWidth: '50',
                            hide: Media.SM,
                        },
                        {
                            name: 'Job Day',
                            selector: (row: JobType) => row.jobDay,
                            sortable: true,
                            sortFunction: (rowA, rowB) => rowA.jobDayNumber - rowB.jobDayNumber,
                        },
                        {
                            name: 'Meal Ticket',
                            selector: (row: JobType) => (row.mealTicket ? 'Yes' : 'No'),
                            maxWidth: '50',
                            hide: Media.SM,
                        },
                        {
                            name: 'Number of positions',
                            selector: (row: JobType) => row.count || 1,
                            maxWidth: '50',
                            hide: Media.SM,
                        },
                        {
                            name: 'Display Order',
                            selector: (row: JobType) => row.sortOrder,
                            sortable: true,
                            maxWidth: '50',
                            hide: Media.SM,
                        },
                    ]
                }
                data={eventJobTypes as any}
                customStyles={
                    {
                        headCells: {
                            style: {
                                paddingTop: '0',
                                fontSize: '1.5em',
                                backgroundColor: '#f9f9f9',
                                color: '#626262',
                            },
                        },
                        cells: {
                            style: {
                                fontSize: '1.2em',
                            },
                        },
                    }
                }
                expandableRows
                expandableRowsComponent={SignupSheetJobsRow}
                expandableRowsComponentProps={rowCallbackProp}
                striped
                responsive
            />
            <Box height="10" />
        </VStack>
    );
}
export default EventSignupSheet;
