import React, { useEffect, useState } from 'react'
import zxcvbn from 'zxcvbn'

const PasswordStrengthMeter = (props) => {
    const { data } = props
    const [score, setScore] = useState(false)

    const createPasswordLabel = (result) => {
        //

        switch (result.score) {
            case 0:
                return 'Weak'
            case 1:
                return 'Weak'
            case 2:
                return 'Fair'
            case 3:
                return 'Good'
            case 4:
                return 'Strong'
            default:
                return 'Weak'
        }
    }

    useEffect(() => {
        setScore(zxcvbn(data.formik.values.password))
    }, [data.formik.values.password])

    useEffect(() => {
        if (score) {
            data.formik.setFieldValue(data.name, parseInt(score.score))
        }
    }, [score])

    return (
        <div className="password-strength-meter">
            {data.formik.values.password && (
                <>
                    <label className="password-strength-meter-label">
                        <strong>Password strength: </strong>
                        {createPasswordLabel(score)}
                    </label>
                    <div>
                        <progress
                            className={`password-strength-meter-progress strength-${createPasswordLabel(
                                score,
                            )}`}
                            value={score.score}
                            max="4"
                        />
                        <p className="scheduleError">
                            {data.hideMessage
                                ? null
                                : data.formik.errors[data.name] && data.formik.errors[data.name]}
                        </p>
                    </div>
                    <br />
                </>
            )}
        </div>
    )
}

export default PasswordStrengthMeter
