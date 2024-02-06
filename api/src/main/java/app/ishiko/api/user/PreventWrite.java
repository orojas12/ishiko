package app.ishiko.api.user;

import jakarta.persistence.PrePersist;
import jakarta.persistence.PreRemove;
import jakarta.persistence.PreUpdate;

public class PreventWrite {

    @PrePersist
    void onPrePersist(Object o) {
        throw new IllegalStateException("Attempt to persist entity of type "
                + (o == null ? "null" : o.getClass()));
    }

    @PreUpdate
    void onPreUpdate(Object o) {
        throw new IllegalStateException("Attempt to update entity of type "
                + (o == null ? "null" : o.getClass()));
    }

    @PreRemove
    void onPreRemove(Object o) {
        throw new IllegalStateException("Attempt to remove entity of type "
                + (o == null ? "null" : o.getClass()));
    }
}
