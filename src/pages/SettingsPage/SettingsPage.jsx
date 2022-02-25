import { IconButton, Paper, Table, TableBody, TableCell, TableHead, TablePagination, TableRow, Tooltip } from '@mui/material'
import {
    Add as AddIcon,
    Remove as RemoveIcon,
    ArrowDropDown as ArrowDropDownIcon,
    ArrowDropUp as ArrowDropUpIcon
} from '@mui/icons-material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import './SettingsPage.scss'

function SettingsPage({onAddCurr}) {

    const [currencies, setCurrencies] = useState([])
    const [rowsPerPage, setRowsPerPage] = useState(10);
    const [page, setPage] = useState(0);
    const [sortBy, setSortBy] = useState('')
    const [sorting, setSorting] = useState('')

    useEffect(() => {
        axios.get('https://www.nbrb.by/api/exrates/currencies')
        .then(res => {
            setCurrencies(res.data)
        })
        .catch(err => console.log(err.response))
    }, [])

    const handleChangePage = (event, newPage) => {
        setPage(newPage);
    };

    const handleChangeRowsPerPage = (event) => {
        setRowsPerPage(+event.target.value);
        setPage(0);
    };

    const addCurrHandler = (row) => {
        setCurrencies(currencies => {
        return currencies.map(curr => {
            if (curr.Cur_ID === row.Cur_ID) {
                return {
                    ...curr,
                    isAdded: true
                }
            }
            return curr
        })})
        onAddCurr(row)
    }

    const deleteCurrHandler = (row) => {
        console.log(row)
    }

    const sortHandler = () => {
        switch (sortBy) {
            case 'name': {
                sorting == 'asc' ?
                setCurrencies(curr => {return curr.sort((a, b) => a.Cur_Name.localeCompare(b.Cur_Name))}) : 
                setCurrencies(curr => {return curr.sort((a, b) => b.Cur_Name.localeCompare(a.Cur_Name))})
                console.log(currencies)
            }
            case 'abbr': {
                sorting === 'asc' ?
                setCurrencies(curr => {return [...currencies.sort((a, b) => a.Cur_Abbreviation.localeCompare(b.Cur_Abbreviation))]}) :
                setCurrencies(curr => {return [...currencies.sort((a, b) => b.Cur_Abbreviation.localeCompare(a.Cur_Abbreviation))]})
            }
        }
        console.log(sorting, sortBy)
    }

  return (
    <Paper className='app-inner'>
        <Table>
            <TableHead>
                <TableRow>
                    <TableCell onClick={() => {
                        setSortBy('name')
                        sorting === 'desc' ? setSorting('asc') : setSorting('desc')
                        sortHandler()
                        }}>Name {sortBy === 'name' ? (sorting === 'desc' ? <ArrowDropDownIcon/> : <ArrowDropUpIcon/>) : ''}</TableCell>
                    <TableCell onClick={() => {
                        setSortBy('abbr')
                        sorting === 'desc' ? setSorting('asc') : setSorting('desc')
                        sortHandler()
                        }}>Abbreviation {sortBy === 'abbr' ? (sorting === 'desc' ? <ArrowDropDownIcon/> : <ArrowDropUpIcon/>) : ''}</TableCell>
                    <TableCell>Action</TableCell>
                </TableRow>
            </TableHead>
            <TableBody>
                {
                    currencies && currencies
                    .slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage)
                    .map((row,i) => {
                        return <Row onAdd={addCurrHandler} onDelete={deleteCurrHandler} key={i} row={row}></Row>
                    })
                }
            </TableBody>
        </Table>
            { currencies ?
            <TablePagination
                rowsPerPageOptions={[10, 25, 100]}
                component="div"
                count={currencies.length}
                rowsPerPage={rowsPerPage}
                page={page}
                onPageChange={handleChangePage}
                onRowsPerPageChange={handleChangeRowsPerPage}
            /> : ''
            }
    </Paper>
  )
}

export default SettingsPage

const Row = ({row, onAdd, onDelete}) => {


    return (
        <TableRow>
            <TableCell>{row.Cur_Name}</TableCell>
            <TableCell>{row.Cur_Abbreviation}</TableCell>
            <TableCell>
                {
                    row.isAdded ?
                        <Tooltip title="Remove currency from favorite" arrow>
                            <IconButton onClick={() => onDelete(row)}>
                                <RemoveIcon/>
                            </IconButton>
                        </Tooltip>
                    :
                        <Tooltip title="Add currency to favorite" arrow>
                            <IconButton onClick={() => onAdd(row)}>
                                <AddIcon/>
                            </IconButton>
                        </Tooltip>
                }
            </TableCell>
        </TableRow>
    )
}