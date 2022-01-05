import React from 'react';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';
import CollapsingRow from '../GeneralComponents/CollapsingRow';
import Paper from '@mui/material/Paper';


function FarmsTable(props:any){

    const {rows} = props;
    


    const html = (<TableContainer component={Paper}>
        <Table className="table-striped table-dark" aria-label="collapsible table">
          <TableHead>
            <TableRow>
              
              <TableCell >Pair</TableCell>
              <TableCell align="right">Provider</TableCell>
              <TableCell align="right">Farm</TableCell>
              <TableCell align="right">Earned</TableCell>
              <TableCell align="right">APR</TableCell>
              <TableCell align="right">Liquidity</TableCell>
              <TableCell align="right"></TableCell>
              <TableCell />
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row:any,i:any) => (
              <CollapsingRow key={props.sort ? "B"+i : "A"+i}  row={row} />
            ))}
          </TableBody>
        </Table>
      </TableContainer>)

    
    return html;



}


export default FarmsTable;