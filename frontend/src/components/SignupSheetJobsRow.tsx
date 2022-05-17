import {
    Box, Button, NumberInput, NumberInputField, Select, SimpleGrid, Text, useToast,
} from '@chakra-ui/react';
import React, { useContext, useState } from 'react';
import { EventJob } from '../../../src/typedefs/eventJob';
import { JobType } from '../../../src/typedefs/jobType';
import { UserContext } from '../contexts/UserContext';
import { getEventJob, updateEventJob } from '../controller/eventJob';
import { updateJobType } from '../controller/jobType';

interface RowProps {
    data: JobType,
}

/**
 * A component representing a row in a PRA signup sheet, with all the data to represent a job.
 *
 * @param props
 * @returns
 */
function SignupSheetJobsRow(props: RowProps) {
    const { state } = useContext(UserContext);
    const disableInputs = (state.user?.memberType !== 'Admin');

    const { data } = props;
    const toast = useToast();

    const mealTicket = data.mealTicket ? 'Yes' : 'No';
    const [pointValue, setPointValue] = useState<number>(data.pointValue);
    const [cashValue, setCashValue] = useState<number>(data.cashValue);
    const [mealTicketValue, setMealTicketValue] = useState<boolean>(data.mealTicket);
    const [count, setCount] = useState<number>(data.count || -1);
    const [sortOrder, setSortOrder] = useState<number>(data.sortOrder);
    const [dirty, setDirty] = useState<boolean>(false);

    const jobCopy = JSON.parse(JSON.stringify(data));

    return (
        <Box ml={20} maxWidth="50%">
            <SimpleGrid columns={[2, 3, 3]} spacing={2}>
                <Box maxWidth={100}>
                    <Text fontSize="sm">Point Value</Text>
                    <NumberInput min={0} max={30} step={0.25}>
                        <NumberInputField
                            placeholder={`${data.pointValue}`}
                            onChange={
                                (event) => {
                                    setPointValue(parseFloat(event.target.value));
                                    setDirty(true);
                                }
                            }
                        />
                    </NumberInput>
                </Box>
                <Box maxWidth={100}>
                    <Text fontSize="sm">Cash Payout</Text>
                    <NumberInput min={0} max={750} step={10}>
                        <NumberInputField
                            placeholder={`${data.cashValue}`}
                            onChange={
                                (event) => {
                                    setCashValue(parseFloat(event.target.value));
                                    setDirty(true);
                                }
                            }
                        />
                    </NumberInput>
                </Box>
                <Box maxWidth={100}>
                    <Text fontSize="sm">Meal Ticket?</Text>
                    <Select
                        placeholder={mealTicket}
                        disabled={disableInputs}
                        onChange={
                            (event) => {
                                setMealTicketValue(event.target.value === 'true');
                                setDirty(true);
                            }
                        }
                    >
                        {
                            !data.mealTicket ? <option value="true">Yes</option>
                                : <option value="false">No</option>
                        }
                    </Select>
                </Box>
                <Box maxWidth={100}>
                    <Text fontSize="sm">Positions</Text>
                    <NumberInput min={1} max={300} step={1}>
                        <NumberInputField
                            placeholder={`${data.count}`}
                            onChange={
                                (event) => {
                                    setCount(parseInt(event.target.value, 10));
                                    setDirty(true);
                                }
                            }
                        />
                    </NumberInput>
                </Box>
                <Box maxWidth={100}>
                    <Text fontSize="sm">Display Order</Text>
                    <NumberInput min={1} max={300} step={1}>
                        <NumberInputField
                            placeholder={`${data.sortOrder}`}
                            onChange={
                                (event) => {
                                    setSortOrder(parseInt(event.target.value, 10));
                                    setDirty(true);
                                }
                            }
                        />
                    </NumberInput>
                </Box>
            </SimpleGrid>
            <Button
                disabled={disableInputs || !dirty}
                backgroundColor="orange.300"
                color="white"
                mt={2}
                onClick={
                    async () => {
                        jobCopy.pointValue = pointValue;
                        jobCopy.cashValue = cashValue;
                        jobCopy.mealTicket = mealTicketValue;
                        jobCopy.count = count;
                        jobCopy.sortOrder = sortOrder;
                        jobCopy.active = true;
                        if (dirty) {
                            // save the job type
                            const eventJob = await getEventJob(state.token, jobCopy.eventJobId) as EventJob;
                            eventJob.count = jobCopy.count;
                            await updateEventJob(state.token, jobCopy.eventJobId, eventJob);
                            await updateJobType(state.token, jobCopy.jobTypeId, jobCopy);
                        }
                        setDirty(false);
                        toast({
                            containerStyle: {
                                background: 'orange',
                            },
                            // eslint-disable-next-line max-len
                            title: `${jobCopy.title} updated. (Job Type ID ${jobCopy.jobTypeId} user ${state.user?.email})`,
                            description: JSON.stringify(jobCopy),
                            status: 'success',
                            duration: 5000,
                            isClosable: true,
                        });
                    }
                }
            >
                Save
            </Button>
        </Box>
    );
}

export default SignupSheetJobsRow;