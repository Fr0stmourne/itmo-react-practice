import React, { Component } from 'react';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import ImageDialog from './ImageDialog';
import { getNasaData } from '../api/table'

class NasaTable extends Component {

    constructor (props) {
        super(props)
        this.state = {
            data: {},
            visibleRows: null,
            page: 0,
            rowsPerPage: 10,
            open: false,
            onLink: false
        }
    }

    handleClose = () => this.setState({ open: false })

    getDataToShow = (table, from, rowsRepPage) => table.filter((row, i) => i >= from && i < from + rowsRepPage)

    nextPage = async () => {
        const { rowsPerPage, page, data } = this.state
        const from = rowsPerPage * (page + 1)
        const visibleRows = this.getDataToShow(data.table, from, rowsPerPage)
        this.setState({ visibleRows, page: page + 1 })
    }

    prevPage = async () => {
        const { rowsPerPage, page, data } = this.state
        const from = rowsPerPage * (page - 1)
        const visibleRows = this.getDataToShow(data.table, from, rowsPerPage)
        this.setState({ visibleRows, page: page - 1 })
    }

    changeRow = async (e) => {
        const { data } = this.state
        const rows = +e.target.value
        const visibleRows = this.getDataToShow(data.table, 0, rows)
        this.setState({ rowsPerPage: rows, visibleRows, page: 0 })
    }

    fillCells = (cell, i) => {
        if (i !== 0) {
            return (<TableCell key={i}>{ cell }</TableCell>)
        }
        return (
            <TableCell
                key={i}
                onClick={this.openDialog}
                onMouseEnter={ () => this.setState({onLink: true})}
                onMouseLeave={ () => this.setState({onLink: false})}
                className={`first-item ${this.state.onLink && 'on-link'}`}
            >
                { cell }
            </TableCell>)
    }

    openDialog = () => this.setState({ open: true })

    componentDidMount = async () => {
        const { rowsPerPage, page } = this.state;
        const res = await getNasaData();
        const data = await res.json();
        const from = rowsPerPage * page
        const visibleRows = this.getDataToShow(data.table, from, rowsPerPage)
        this.setState({ data, visibleRows })
    }

    render() {
        const { data, page, rowsPerPage, visibleRows, open } = this.state
        const { headers, table = [] } = data
        return(
            <React.Fragment>
                <ImageDialog open={ open } onClose={ this.handleClose }/>
                <Table>
                    <TableHead>
                        <TableRow>
                            { headers && headers.map((el, i) => <TableCell  className='table-headers' key={i}>{ el }</TableCell>)}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        { visibleRows && visibleRows.map((row, i) => <TableRow key={i}>
                            { row.info.map((cell, i) => this.fillCells(cell, i)) }
                        </TableRow>) }
                    </TableBody>
                </Table>
                <TablePagination
                    rowsPerPageOptions={[5, 10, 25]}
                    component='div'
                    count={table && table.length}
                    rowsPerPage={rowsPerPage}
                    page={page}
                    onChangeRowsPerPage={this.changeRow}
                    backIconButtonProps={{
                        'aria-label': 'Previous Page',
                        'onClick': this.prevPage
                    }}
                    nextIconButtonProps={{
                        'aria-label': 'Next Page',
                        'onClick': this.nextPage
                    }}
                    onChangePage={() => {}}
                />
            </React.Fragment>
        )
    }
}

export default NasaTable