import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Link from "next/link";

export default function Nav() {
  return (
    <Box sx={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link href="/">Show Execute Big!</Link>  
          </Typography>
          <Button color="inherit">
            <Link href="/new"><a target="_blank">New Project</a></Link>
          </Button>
        </Toolbar>
      </AppBar>
    </Box>
  );
}
