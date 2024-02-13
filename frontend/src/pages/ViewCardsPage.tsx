import { Button, Typography } from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';

export default function ViewCards() {
    return (
        <div>
            <div>
                <Button>Back</Button>
            </div>
            <div>
                <h2>setTitle</h2>
                <div>
                    <div>
                        <Typography>Front</Typography>

                        <Typography>Back</Typography>
                    </div>
                    <div>
                        <Button>
                            <ArrowBackIcon />
                        </Button>
                        <Button>
                            Flip
                        </Button>
                        <Button>
                            <ArrowForwardIcon />
                        </Button>
                    </div>
                </div>
            </div>

            
        </div>
    );
};