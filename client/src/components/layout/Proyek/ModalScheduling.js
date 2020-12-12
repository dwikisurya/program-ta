import React, { Fragment, useState, useEffect } from 'react'

const ModalRAB = ({ rowData }) => {

    return (
        <Fragment>
            <button
                type="button"
                className="btn btn-warning"
                data-toggle="modal"
                data-target={`#_id${rowData.id}`}
            >Edit</button>

            <div
                className="modal"
                id={`_id${rowData.id}`}

            >
                <div className="modal-dialog">
                    <div className="modal-content">
                        <div className="modal-header">
                            <h4 className="modal-title">Edit RAB</h4>

                            <button
                                type="button"
                                className="close"
                                data-dismiss="modal"
                            ></button>
                        </div>

                    </div>
                </div>

            </div>
        </Fragment>
    )
}