import React, { useEffect, useState, useContext } from 'react';
import moment from 'moment';
import { Calendar, DateLocalizer, Messages, momentLocalizer, View, ViewsProps } from 'react-big-calendar';
import {
    Text,
    Flex,
    Spacer,
    useDisclosure,
} from '@chakra-ui/react';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import SelectedEventModal from './SelectedEventModal';
import SignUpModal from './SignUpModal';
import { UserContext } from '../contexts/UserContext';
import { getJobAttendees } from '../controller/job';
import { getFamilyMembers } from '../controller/member';
import { Event } from '../../../src/typedefs/event';

const RenderToolbar = require('react-big-calendar/lib/Toolbar');

const localizer: DateLocalizer = momentLocalizer(moment);

interface EventCalendarProps {
    events: Event[],
}

interface CustomToolbarProps {
    date: Date,
    view: View,
    views: ViewsProps<any, never>,
    label: string,
}

const customMessages: Messages = {
    next: 'Next',
    previous: 'Previous',
    today: 'Today',
    day: 'Day',
    week: 'Week',
    month: 'Month',
    agenda: 'Agenda',
};

async function getSelectedJobAttendees(): Promise<any> {
    const attendees = await getJobAttendees();
    return attendees;
}

async function getCurrentFamilyMembers(): Promise<any> {
    const currentFamilyMembers = await getFamilyMembers();
    return currentFamilyMembers;
}

export default function EventCalendar(props: EventCalendarProps) {
    const { state } = useContext(UserContext);
    const { onClose: onViewEventClose, isOpen: isViewEventOpen, onOpen: onViewEventOpen } = useDisclosure();
    const { onClose: onSignUpClose, isOpen: isSignUpOpen, onOpen: onSignUpOpen } = useDisclosure();
    const [selectedEvent, setSelectedEvent] = useState<any>();
    const [eventAttendees, setAttendees] = useState<any>();
    const [familyMembers, setFamilyMembers] = useState<any>();

    useEffect(() => {
        async function getData() {
            const attendees = await getSelectedJobAttendees();
            const currentFamilyMembers = await getCurrentFamilyMembers();
            setAttendees(attendees);
            setFamilyMembers(currentFamilyMembers);
        }
        getData();
    }, []);

    return (
        <div>
            <Calendar
                defaultView="month"
                events={props.events}
                selected={selectedEvent}
                onSelectEvent={
                    (event) => {
                        setSelectedEvent(event);
                        onViewEventOpen();
                    }
                }
                localizer={localizer}
                eventPropGetter={
                    (event) => {
                        const newStyle = {
                            backgroundColor: 'lightgrey',
                            color: 'black',
                        };
                        if (event.eventType) {
                            if (event.eventType === 'Meeting') {
                                newStyle.backgroundColor = '#76CE6F';
                            } else if (
                                event.eventType === 'Yearly Job' ||
                                event.eventType === 'Work Day') {
                                newStyle.backgroundColor = '#68A9FF';
                            } else if (
                                event.eventType === 'Race' ||
                                event.eventType === 'Race Week' ||
                                event.eventType === 'XO Race' ||
                                event.eventType === 'Harescramble') {
                                newStyle.backgroundColor = '#EE6439';
                            } else {
                                newStyle.backgroundColor = 'lightgrey';
                            }
                            return {
                                style: newStyle,
                            };
                        }
                        // sets all jobs to blue
                        newStyle.backgroundColor = '#68A4FF';
                        return {
                            style: newStyle,
                        };
                    }
                }
                style={{ height: '70vh' }}
                components={
                    {
                        toolbar: React.memo((toolbarProps: CustomToolbarProps, children) => (
                            <RenderToolbar
                                // Necessary for the custom toolbar to render properly
                                // eslint-disable-next-line react/jsx-props-no-spreading
                                {...toolbarProps}
                                localizer={
                                    {
                                        messages: {
                                            ...customMessages,
                                        },
                                    }
                                }
                                label={
                                    (
                                        <Flex pl={20}>
                                            <Spacer />
                                            <Text
                                                fontFamily="sans-serif"
                                                fontWeight={30}
                                                fontSize="3xl"
                                            >
                                                {toolbarProps.label}
                                            </Text>
                                            <Spacer />
                                        </Flex>
                                    )
                                }
                            >
                                {children}
                            </RenderToolbar>
                        )),
                    }
                }
            />
            {
                selectedEvent && eventAttendees && (
                    <SelectedEventModal
                        isOpen={isViewEventOpen}
                        onClose={onViewEventClose}
                        selectedEvent={selectedEvent}
                        onSignUpOpen={onSignUpOpen}
                        admin={state.user?.memberType === 'Admin'}
                    />
                )
            }
            {
                familyMembers && eventAttendees && (
                    <SignUpModal
                        isOpen={isSignUpOpen}
                        onClose={onSignUpClose}
                        attendeesList={eventAttendees}
                        familyMembers={familyMembers}
                    />
                )
            }
        </div>
    );
}
