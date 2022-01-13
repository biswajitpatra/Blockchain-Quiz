import { Controller, useForm } from 'react-hook-form';
import { motion } from 'framer-motion';

import DateTimePicker from 'react-datetime-picker/dist/entry.nostyle';
import 'react-calendar/dist/Calendar.css';
import 'react-clock/dist/Clock.css';
import 'react-datetime-picker/dist/DateTimePicker.css';

const ease = [0.43, 0.13, 0.23, 0.96];

const stepVariants = {
    initial: {
        y: '50%',
        opacity: 0,
        transition: { ease, duration: 0.8, delay: 0.5 },
    },
    animate: {
        y: '0%',
        opacity: 1,
        transition: { ease, duration: 0.8 },
    },
    exit: {
        y: '50%',
        opacity: 0,
        transition: { ease, duration: 0.8 },
    },
};

export default function QuizDetailForm({ updateFormData }) {
    const {
        control,
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    return (
        <motion.div
            variants={stepVariants}
            className="bg-gray-100 flex flex-col p-8 rounded-lg"
        >
            <form onSubmit={handleSubmit(updateFormData)}>
                <div className="mb-4">
                    <label
                        className="text-gray-700 font-bold mb-2"
                        htmlFor="quizName"
                    >
                        Name of Quiz
                    </label>
                    <input
                        {...register('quizName')}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="text"
                        placeholder="Some amazing name for your quiz"
                    />
                </div>

                <div className="mb-4">
                    <label
                        className="text-gray-700 font-bold mb-2"
                        htmlFor="prizeMoney"
                    >
                        Prize Money
                    </label>
                    <input
                        {...register('prizeMoney', { valueAsNumber: true })}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="number"
                        min="0"
                        placeholder="in Wei"
                    />
                </div>

                <div className="mb-4">
                    <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="description"
                    >
                        Description
                        <textarea
                            {...register('description')}
                            className="shadow form-textarea mt-1 block w-full border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                            rows="5"
                            placeholder="Some info for players (optional)"
                        ></textarea>
                    </label>
                </div>

                <div className="mb-4">
                    <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="startTime"
                    >
                        {' '}
                        Quiz start time
                    </label>
                    <Controller
                        control={control}
                        name="startTime"
                        defaultValue={new Date().getTime()}
                        rules={{
                            validate: (v) =>
                                v > new Date().getTime() ||
                                'Quiz start time should be greater than present time',
                        }}
                        render={({ field }) => {
                            return (
                                <DateTimePicker
                                    required
                                    amPmAriaLabel="Select AM/PM"
                                    calendarAriaLabel="Toggle calendar"
                                    clearIcon={null}
                                    dayAriaLabel="Day"
                                    hourAriaLabel="Hour"
                                    maxDetail="second"
                                    minuteAriaLabel="Minute"
                                    monthAriaLabel="Month"
                                    nativeInputAriaLabel="Date and time"
                                    secondAriaLabel="Second"
                                    yearAriaLabel="Year"
                                    className="shadow bg-white"
                                    calendarClassName="rounded"
                                    clockClassName="rounded"
                                    onChange={(e) =>
                                        field.onChange(e.getTime())
                                    }
                                    value={new Date(field.value)}
                                />
                            );
                        }}
                    />
                    <p className="text-red-600 font-normal text-xs">
                        {errors.startTime?.message}
                    </p>
                </div>

                <div className="mb-4">
                    <label
                        className="block text-gray-700 font-bold mb-2"
                        htmlFor="duration"
                    >
                        {' '}
                        Quiz duration (in minutes)
                    </label>
                    <input
                        {...register('duration', { valueAsNumber: true })}
                        required
                        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                        type="number"
                        min="1"
                        placeholder="in Minutes"
                    />
                </div>

                <div className="mb-4">
                    <input
                        {...register('automate')}
                        defaultChecked={true}
                        type="checkbox"
                        id="automate"
                    />
                    <label
                        className="text-gray-700 font-bold mb-2"
                        htmlFor="automate"
                    >
                        {' '}
                        Add schedulers for calling the contract? (This will
                        automatically call the contract for you or you mave to
                        manually call the contract during start and end of the
                        quiz )
                    </label>
                </div>

                <div className="flex items-center justify-between">
                    <button
                        className="transition ease-in-out duration-300 bg-blue-500 hover:bg-indigo-500 hover:scale-105 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
                        type="submit"
                    >
                        Lets create questions
                    </button>
                </div>
            </form>
        </motion.div>
    );
}
